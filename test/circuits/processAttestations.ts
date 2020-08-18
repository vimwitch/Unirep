import chai from "chai"

const { expect } = chai

import {
    compileAndLoadCircuit,
} from './utils'
import { computeAttestationHash } from '../utils'

import {
    genRandomSalt,
    hash5,
    hashLeftRight,
    SnarkBigInt,
} from 'maci-crypto'
import { genIdentity } from 'libsemaphore'

describe('Process attestation circuit', () => {
    describe('Process zero attestation', () => {
        let circuit

        const epoch = 1
        const user = genIdentity()
        const NUM_ATTESTATIONS = 0
        let hashChainResult

        before(async () => {
            circuit = await compileAndLoadCircuit('test/processZeroAttestations_test.circom')

            hashChainResult = hashLeftRight(1, 0)
        })

        it('successfully process zero attestations', async () => {
            const circuitInputs = {
                epoch: epoch,
                identity_nullifier: user['identityNullifier'],
                attester_ids: [],
                pos_reps: [],
                neg_reps: [],
                graffities: [],
                overwrite_graffitis: [],
                hash_chain_result: hashChainResult
            }

            const witness = circuit.calculateWitness(circuitInputs)
            expect(circuit.checkWitness(witness)).to.be.true
        })

        it('process zero attestation with incorrect hash chain result should fail', async () => {
            const wrongHashChainResult = genRandomSalt()
            const circuitInputs = {
                epoch: epoch,
                identity_nullifier: user['identityNullifier'],
                attester_ids: [],
                pos_reps: [],
                neg_reps: [],
                graffities: [],
                overwrite_graffitis: [],
                hash_chain_result: wrongHashChainResult
            }

            const resultNotMatchRegExp = RegExp('.+ -> ' + wrongHashChainResult + ' != ' + hashChainResult + '$')
            expect(() => {
                circuit.calculateWitness(circuitInputs)
            }).to.throw(resultNotMatchRegExp)
        })
    })

    describe('Process more than one attestation', () => {
        let circuit

        const epoch = 1
        const user = genIdentity()
        const NUM_ATTESTATIONS = 3

        let attesterIds: SnarkBigInt[], posReps: number[], negReps: number[], graffities: SnarkBigInt[], overwriteGraffitis: boolean[]
        let nullifiers: SnarkBigInt[]
        let hashChainResult: SnarkBigInt

        before(async () => {
            circuit = await compileAndLoadCircuit('test/processAttestations_test.circom')

            attesterIds = []
            posReps = []
            negReps = []
            graffities = []
            overwriteGraffitis = []

            nullifiers = []
            hashChainResult = 0
            for (let i = 0; i < NUM_ATTESTATIONS; i++) {
                const attestation = {
                    attesterId: i + 1,
                    posRep: Math.floor(Math.random() * 100),
                    negRep: Math.floor(Math.random() * 100),
                    graffiti: genRandomSalt(),
                    overwriteGraffiti: true,
                }
                attesterIds.push(attestation['attesterId'])
                posReps.push(attestation['posRep'])
                negReps.push(attestation['negRep'])
                graffities.push(attestation['graffiti'])
                overwriteGraffitis.push(attestation['overwriteGraffiti'])

                const attestation_hash = computeAttestationHash(attestation)
                hashChainResult = hashLeftRight(attestation_hash, hashChainResult)

                nullifiers[i] = hash5([user['identityNullifier'], attestation['attesterId'], epoch, 0, 0])
            }
            hashChainResult = hashLeftRight(1, hashChainResult)
        })

        it('successfully process attestations', async () => {
            const circuitInputs = {
                epoch: epoch,
                identity_nullifier: user['identityNullifier'],
                attester_ids: attesterIds,
                pos_reps: posReps,
                neg_reps: negReps,
                graffities: graffities,
                overwrite_graffitis: overwriteGraffitis,
                hash_chain_result: hashChainResult
            }

            const witness = circuit.calculateWitness(circuitInputs)
            expect(circuit.checkWitness(witness)).to.be.true
            for (let i = 0; i < NUM_ATTESTATIONS; i++) {
                expect(witness[circuit.getSignalIdx('main.nullifiers[' + i + ']')])
                    .to.equal(nullifiers[i])
            }
        })

        it('process attestations with wrong epoch should fail', async () => {
            const wrongEpoch = epoch + 1
            const circuitInputs = {
                epoch: wrongEpoch,
                identity_nullifier: user['identityNullifier'],
                attester_ids: attesterIds,
                pos_reps: posReps,
                neg_reps: negReps,
                graffities: graffities,
                overwrite_graffitis: overwriteGraffitis,
                hash_chain_result: hashChainResult
            }

            const witness = circuit.calculateWitness(circuitInputs)
            expect(circuit.checkWitness(witness)).to.be.true
            for (let i = 0; i < NUM_ATTESTATIONS; i++) {
                expect(witness[circuit.getSignalIdx('main.nullifiers[' + i + ']')])
                    .to.not.equal(nullifiers[i])
            }
        })

        it('process attestations with wrong nullifier should fail', async () => {
            const otherUser = genIdentity()
            const circuitInputs = {
                epoch: epoch,
                identity_nullifier: otherUser['identityNullifier'],
                attester_ids: attesterIds,
                pos_reps: posReps,
                neg_reps: negReps,
                graffities: graffities,
                overwrite_graffitis: overwriteGraffitis,
                hash_chain_result: hashChainResult
            }

            const witness = circuit.calculateWitness(circuitInputs)
            expect(circuit.checkWitness(witness)).to.be.true
            for (let i = 0; i < NUM_ATTESTATIONS; i++) {
                expect(witness[circuit.getSignalIdx('main.nullifiers[' + i + ']')])
                    .to.not.equal(nullifiers[i])
            }
        })

        it('process attestations with incorrect number of elements should fail', async () => {
            const wrongAttesterIds = attesterIds.concat([4])
            const circuitInputs = {
                epoch: epoch,
                identity_nullifier: user['identityNullifier'],
                attester_ids: wrongAttesterIds,
                pos_reps: posReps,
                neg_reps: negReps,
                graffities: graffities,
                overwrite_graffitis: overwriteGraffitis,
                hash_chain_result: hashChainResult
            }

            expect(() => {
                circuit.calculateWitness(circuitInputs)
            }).to.throw('Invalid signal identifier: main.attester_ids[' + NUM_ATTESTATIONS + ']')
        })

        it('process attestations with incorrect hash chain result should fail', async () => {
            const wrongHashChainResult = genRandomSalt()
            const circuitInputs = {
                epoch: epoch,
                identity_nullifier: user['identityNullifier'],
                attester_ids: attesterIds,
                pos_reps: posReps,
                neg_reps: negReps,
                graffities: graffities,
                overwrite_graffitis: overwriteGraffitis,
                hash_chain_result: wrongHashChainResult
            }

            const resultNotMatchRegExp = RegExp('.+ -> ' + wrongHashChainResult + ' != ' + hashChainResult + '$')
            expect(() => {
                circuit.calculateWitness(circuitInputs)
            }).to.throw(resultNotMatchRegExp)
        })
    })
})