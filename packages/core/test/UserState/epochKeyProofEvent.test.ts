// @ts-ignore
import { ethers as hardhatEthers } from 'hardhat'
import { ethers } from 'ethers'
import { expect } from 'chai'
import {
    genRandomSalt,
    ZkIdentity,
    hashLeftRight,
    IncrementalMerkleTree,
} from '@unirep/crypto'
import { Circuit, genProofAndPublicSignals } from '@unirep/circuits'
import { deployUnirep, EpochKeyProof, Unirep } from '@unirep/contracts'

import {
    computeInitUserStateRoot,
    genUnirepState,
    genUserState,
    Reputation,
} from '../../src'
import { genEpochKeyCircuitInput, genRandomAttestation } from '../utils'

describe('Epoch key proof events in Unirep User State', function () {
    this.timeout(0)

    let userIds: ZkIdentity[] = []
    let userCommitments: BigInt[] = []
    let userStateTreeRoots: BigInt[] = []
    let signUpAirdrops: Reputation[] = []

    let unirepContract: Unirep

    let treeDepths

    let accounts: ethers.Signer[]
    const attester = new Object()
    let attesterId
    const maxUsers = 10
    const userNum = Math.ceil(Math.random() * maxUsers)
    const attestingFee = ethers.utils.parseEther('0.1')
    const fromProofIndex = 0

    before(async () => {
        accounts = await hardhatEthers.getSigners()

        unirepContract = await deployUnirep(<ethers.Wallet>accounts[0], {
            maxUsers,
            attestingFee,
        })

        treeDepths = await unirepContract.treeDepths()
    })

    describe('Attester sign up and set airdrop', async () => {
        it('attester sign up', async () => {
            attester['acct'] = accounts[2]
            attester['addr'] = await attester['acct'].getAddress()

            let tx = await unirepContract
                .connect(attester['acct'])
                .attesterSignUp()
            let receipt = await tx.wait()
            expect(receipt.status, 'Attester signs up failed').to.equal(1)
            attesterId = await unirepContract.attesters(attester['addr'])
        })

        it('attester set airdrop amount', async () => {
            const airdropPosRep = 10
            const tx = await unirepContract
                .connect(attester['acct'])
                .setAirdropAmount(airdropPosRep)
            const receipt = await tx.wait()
            expect(receipt.status).equal(1)
            const airdroppedAmount = await unirepContract.airdropAmount(
                attester['addr']
            )
            expect(airdroppedAmount.toNumber()).equal(airdropPosRep)
        })
    })

    describe('User Sign Up event', async () => {
        it('sign up users through attester who sets airdrop', async () => {
            for (let i = 0; i < userNum; i++) {
                const id = new ZkIdentity()
                const commitment = id.genIdentityCommitment()
                userIds.push(id)
                userCommitments.push(commitment)

                const tx = await unirepContract
                    .connect(attester['acct'])
                    .userSignUp(commitment)
                const receipt = await tx.wait()
                expect(receipt.status, 'User sign up failed').to.equal(1)

                await expect(
                    unirepContract
                        .connect(attester['acct'])
                        .userSignUp(commitment)
                ).to.be.revertedWith(`UserAlreadySignedUp(${commitment})`)

                const userState = await genUserState(
                    hardhatEthers.provider,
                    unirepContract.address,
                    id
                )

                const contractEpoch = await unirepContract.currentEpoch()
                const unirepEpoch = userState.getUnirepStateCurrentEpoch()
                expect(unirepEpoch).equal(Number(contractEpoch))

                const attesterId = await unirepContract.attesters(
                    attester['addr']
                )
                const airdroppedAmount = await unirepContract.airdropAmount(
                    attester['addr']
                )
                const newUSTRoot = await computeInitUserStateRoot(
                    treeDepths.userStateTreeDepth,
                    Number(attesterId),
                    Number(airdroppedAmount)
                )
                userStateTreeRoots.push(newUSTRoot)
                signUpAirdrops.push(
                    new Reputation(
                        airdroppedAmount.toBigInt(),
                        BigInt(0),
                        BigInt(0),
                        BigInt(1)
                    )
                )
            }
        })

        it('sign up users with no airdrop', async () => {
            for (let i = 0; i < maxUsers - userNum; i++) {
                const id = new ZkIdentity()
                const commitment = id.genIdentityCommitment()
                userIds.push(id)
                userCommitments.push(commitment)

                const tx = await unirepContract.userSignUp(commitment)
                const receipt = await tx.wait()
                expect(receipt.status, 'User sign up failed').to.equal(1)

                const userState = await genUserState(
                    hardhatEthers.provider,
                    unirepContract.address,
                    id
                )

                const contractEpoch = await unirepContract.currentEpoch()
                const unirepEpoch = userState.getUnirepStateCurrentEpoch()
                expect(unirepEpoch).equal(Number(contractEpoch))

                const newUSTRoot = await computeInitUserStateRoot(
                    treeDepths.userStateTreeDepth
                )
                userStateTreeRoots.push(newUSTRoot)
                signUpAirdrops.push(Reputation.default())
            }
        })
    })

    describe('Epoch key proof event', async () => {
        let epochKey
        let proofIndex
        let epoch
        const userIdx = 1
        it('submit valid epoch key proof event', async () => {
            const userState = await genUserState(
                hardhatEthers.provider,
                unirepContract.address,
                userIds[userIdx]
            )
            epoch = Number(await unirepContract.currentEpoch())
            const epkNonce = 0
            const { proof, publicSignals } =
                await userState.genVerifyEpochKeyProof(epkNonce)
            const epkProofInput = new EpochKeyProof(publicSignals, proof)
            const isValid = await epkProofInput.verify()
            expect(isValid).to.be.true

            const tx = await unirepContract.submitEpochKeyProof(epkProofInput)
            const receipt = await tx.wait()
            expect(receipt.status).to.equal(1)

            epochKey = epkProofInput.epochKey
            proofIndex = Number(
                await unirepContract.getProofIndex(epkProofInput.hash())
            )

            // submit the same proof twice should fail
            await expect(
                unirepContract.submitEpochKeyProof(epkProofInput)
            ).to.be.revertedWith('NullilierAlreadyUsed')
        })

        it('submit attestations to the epoch key should update Unirep state', async () => {
            const attestation = genRandomAttestation()
            attestation.attesterId = attesterId
            const tx = await unirepContract
                .connect(attester['acct'])
                .submitAttestation(
                    attestation,
                    epochKey,
                    proofIndex,
                    fromProofIndex,
                    { value: attestingFee }
                )
            const receipt = await tx.wait()
            expect(receipt.status).to.equal(1)

            const unirepState = await genUnirepState(
                hardhatEthers.provider,
                unirepContract.address
            )
            const attestations = unirepState.getAttestations(epochKey)
            expect(attestations.length).equal(1)
            expect(JSON.stringify(attestations[0])).to.equal(
                JSON.stringify(attestation)
            )
        })

        it('submit invalid epoch key proof event', async () => {
            const userState = await genUserState(
                hardhatEthers.provider,
                unirepContract.address,
                userIds[userIdx]
            )
            epoch = Number(await unirepContract.currentEpoch())
            const epkNonce = 1
            const { proof, publicSignals } =
                await userState.genVerifyEpochKeyProof(epkNonce)
            publicSignals[0] = genRandomSalt().toString()
            const epkProofInput = new EpochKeyProof(publicSignals, proof)
            const isValid = await epkProofInput.verify()
            expect(isValid).to.be.false

            const tx = await unirepContract.submitEpochKeyProof(epkProofInput)
            const receipt = await tx.wait()
            expect(receipt.status).to.equal(1)

            epochKey = epkProofInput.epochKey
            proofIndex = Number(
                await unirepContract.getProofIndex(epkProofInput.hash())
            )
        })

        it('submit attestations to the epoch key should not update Unirep state', async () => {
            const attestation = genRandomAttestation()
            attestation.attesterId = attesterId
            const tx = await unirepContract
                .connect(attester['acct'])
                .submitAttestation(
                    attestation,
                    epochKey,
                    proofIndex,
                    fromProofIndex,
                    { value: attestingFee }
                )
            const receipt = await tx.wait()
            expect(receipt.status).to.equal(1)

            const unirepState = await genUnirepState(
                hardhatEthers.provider,
                unirepContract.address
            )
            const attestations = unirepState.getAttestations(epochKey)
            expect(attestations.length).equal(0)
        })

        it('submit valid epoch key proof with wrong GST root event', async () => {
            const GSTree = new IncrementalMerkleTree(
                treeDepths.globalStateTreeDepth
            )
            const id = new ZkIdentity()
            const commitment = id.genIdentityCommitment()
            const stateRoot = genRandomSalt()
            const leafIndex = 0

            const hashedStateLeaf = hashLeftRight(commitment, stateRoot)
            GSTree.insert(BigInt(hashedStateLeaf.toString()))
            const epkNonce = 0
            const epoch = 1

            const circuitInputs = genEpochKeyCircuitInput(
                id,
                GSTree,
                leafIndex,
                stateRoot,
                epoch,
                epkNonce
            )
            const { proof, publicSignals } = await genProofAndPublicSignals(
                Circuit.verifyEpochKey,
                circuitInputs
            )
            const epkProofInput = new EpochKeyProof(publicSignals, proof)
            const isValid = await epkProofInput.verify()
            expect(isValid).to.be.true

            const tx = await unirepContract.submitEpochKeyProof(epkProofInput)
            const receipt = await tx.wait()
            expect(receipt.status).to.equal(1)

            epochKey = epkProofInput.epochKey
            proofIndex = Number(
                await unirepContract.getProofIndex(epkProofInput.hash())
            )
        })

        it('submit attestations to the epoch key should not update Unirep state', async () => {
            const attestation = genRandomAttestation()
            attestation.attesterId = attesterId
            const tx = await unirepContract
                .connect(attester['acct'])
                .submitAttestation(
                    attestation,
                    epochKey,
                    proofIndex,
                    fromProofIndex,
                    { value: attestingFee }
                )
            const receipt = await tx.wait()
            expect(receipt.status).to.equal(1)

            const unirepState = await genUnirepState(
                hardhatEthers.provider,
                unirepContract.address
            )
            const attestations = unirepState.getAttestations(epochKey)
            expect(attestations.length).equal(0)
        })

        it('submit valid epoch key proof event in wrong epoch', async () => {
            const unirepState = await genUnirepState(
                hardhatEthers.provider,
                unirepContract.address
            )
            const wrongEpoch = epoch + 1
            const epkNonce = 1
            const GSTree = unirepState.genGSTree(unirepState.currentEpoch)
            const circuitInputs = genEpochKeyCircuitInput(
                userIds[userIdx],
                GSTree,
                userIdx,
                userStateTreeRoots[userIdx],
                wrongEpoch,
                epkNonce
            )

            const { proof, publicSignals } = await genProofAndPublicSignals(
                Circuit.verifyEpochKey,
                circuitInputs
            )
            const epkProofInput = new EpochKeyProof(publicSignals, proof)
            const isValid = await epkProofInput.verify()
            expect(isValid).to.be.true

            await expect(
                unirepContract.submitEpochKeyProof(epkProofInput)
            ).to.be.revertedWith('EpochNotMatch()')
        })
    })
})
