import { ethers, waffle } from 'hardhat'
import { Contract, Signer, utils } from 'ethers'
import Keyv from "keyv"
import { IncrementalQuinTree } from 'maci-crypto'
import { SparseMerkleTreeImpl, add0x } from '../crypto/SMT'
import { SnarkBigInt, hash5, hashLeftRight } from '../crypto/crypto'
import { attestingFee, circuitEpochTreeDepth, circuitGlobalStateTreeDepth, circuitNullifierTreeDepth, circuitUserStateTreeDepth, epochLength, epochTreeDepth, globalStateTreeDepth, maxEpochKeyNonce, maxUsers, nullifierTreeDepth, userStateTreeDepth} from '../config/testLocal'

import Unirep from "../artifacts/contracts/Unirep.sol/Unirep.json"
import PoseidonT3 from "../artifacts/contracts/Poseidon.sol/PoseidonT3.json"
import PoseidonT6 from "../artifacts/contracts/Poseidon.sol/PoseidonT6.json"

const getTreeDepthsForTesting = (deployEnv: string = "contract") => {
    if (deployEnv === 'contract') {
        return {
            "userStateTreeDepth": userStateTreeDepth,
            "globalStateTreeDepth": globalStateTreeDepth,
            "epochTreeDepth": epochTreeDepth,
            "nullifierTreeDepth": nullifierTreeDepth,
        }
    } else if (deployEnv === 'circuit') {
        return {
            "userStateTreeDepth": circuitUserStateTreeDepth,
            "globalStateTreeDepth": circuitGlobalStateTreeDepth,
            "epochTreeDepth": circuitEpochTreeDepth,
            "nullifierTreeDepth": circuitNullifierTreeDepth,
        }
    } else {
        throw new Error('Only contract and circuit testing env are supported')
    }
}

const deployUnirep = async (
    deployer: Signer,
    _treeDepths: any,
    _settings?: any): Promise<Contract> => {
    let PoseidonT3Contract, PoseidonT6Contract
    let EpochKeyValidityVerifierContract, UserStateTransitionVerifierContract, ReputationVerifierContract

    console.log('Deploying PoseidonT3')
    PoseidonT3Contract = await waffle.deployContract(
        deployer,
        PoseidonT3
    )
    console.log('Deploying PoseidonT6')
    PoseidonT6Contract = await waffle.deployContract(
        deployer,
        PoseidonT6,
        [],
        {
            gasLimit: 9000000,
        }
    )

    console.log('Deploying EpochKeyValidityVerifier')
    EpochKeyValidityVerifierContract = await (await ethers.getContractFactory(
        "EpochKeyValidityVerifier",
        deployer
    )).deploy()

    console.log('Deploying UserStateTransitionVerifier')
    UserStateTransitionVerifierContract = await (await ethers.getContractFactory(
        "UserStateTransitionVerifier",
        deployer
    )).deploy()

    console.log('Deploying ReputationVerifier')
    ReputationVerifierContract = await (await ethers.getContractFactory(
        "ReputationVerifier",
        deployer
    )).deploy()

    console.log('Deploying Unirep')

    let _maxUsers, _maxEpochKeyNonce, _epochLength, _attestingFee
    if (_settings) {
        _maxUsers = _settings.maxUsers
        _maxEpochKeyNonce = _settings.maxEpochKeyNonce
        _epochLength = _settings.epochLength
        _attestingFee = _settings.attestingFee
    } else {
        _maxUsers = maxUsers
        _maxEpochKeyNonce = maxEpochKeyNonce
        _epochLength = epochLength
        _attestingFee = attestingFee
    }
    const f = await ethers.getContractFactory(
        "Unirep",
        {
            signer: deployer,
            libraries: {
                "PoseidonT3": PoseidonT3Contract.address,
                "PoseidonT6": PoseidonT6Contract.address
            }
        }
    )
    const c = await (f.deploy(
        _treeDepths,
        {
            "maxUsers": _maxUsers,
            "maxEpochKeyNonce": _maxEpochKeyNonce
        },
        EpochKeyValidityVerifierContract.address,
        UserStateTransitionVerifierContract.address,
        ReputationVerifierContract.address,
        _epochLength,
        _attestingFee,
        {
            gasLimit: 9000000,
        }
    ))

    // Print out deployment info
    console.log("-----------------------------------------------------------------")
    console.log("Bytecode size of Unirep:", Math.floor(Unirep.bytecode.length / 2), "bytes")
    let receipt = await c.provider.getTransactionReceipt(c.deployTransaction.hash)
    console.log("Gas cost of deploying Unirep:", receipt.gasUsed.toString())
    console.log("-----------------------------------------------------------------")

    return c
}

const genEpochKey = (identityNullifier: SnarkBigInt, epoch: number, nonce: number, _epochTreeDepth: number = epochTreeDepth): SnarkBigInt => {
    const values: any[] = [
        identityNullifier,
        epoch,
        nonce,
        BigInt(0),
        BigInt(0),
    ]
    let epochKey = hash5(values)
    // Adjust epoch key size according to epoch tree depth
    const epochKeyModed = BigInt(epochKey) % BigInt(2 ** _epochTreeDepth)
    return epochKeyModed
}

const computeReputationHash = (reputation: any): SnarkBigInt => {
    return hash5([
        reputation['posRep'],
        reputation['negRep'],
        reputation['graffiti'],
        BigInt(0),
        BigInt(0),
    ])
}

const computeNullifier = (identityNullifier: SnarkBigInt, attesterId: BigInt, epoch: number, _nullifierTreeDepth: number = nullifierTreeDepth): SnarkBigInt => {
    let nullifier = hash5([identityNullifier, attesterId, BigInt(epoch), BigInt(0), BigInt(0)])
    const nullifierModed = BigInt(nullifier) % BigInt(2 ** _nullifierTreeDepth)
    return nullifierModed
}

const genNoAttestationNullifierKey = (identityNullifier: SnarkBigInt, epoch: number, nonce: number, _nullifierTreeDepth: number = nullifierTreeDepth): SnarkBigInt => {
    let nullifier = hash5([identityNullifier, BigInt(epoch), BigInt(nonce), BigInt(0), BigInt(0)])
    // Adjust epoch key size according to epoch tree depth
    const nullifierModed = BigInt(nullifier) % BigInt(2 ** _nullifierTreeDepth)
    return nullifierModed
}

const toCompleteHexString = (str: string, len?: number): string => {
    str = add0x(str)
    if (len) str = utils.hexZeroPad(str, len)
    return str
}

const SMT_ZERO_LEAF = hashLeftRight(BigInt(0), BigInt(0))
const SMT_ONE_LEAF = hashLeftRight(BigInt(1), BigInt(0))

const genNewSMT = async (treeDepth: number, defaultLeafHash: BigInt): Promise<SparseMerkleTreeImpl> => {
    return SparseMerkleTreeImpl.create(
        new Keyv(),
        treeDepth,
        defaultLeafHash,
    )
}

const genNewEpochTree = async (deployEnv: string = "contract"): Promise<SparseMerkleTreeImpl> => {
    let _epochTreeDepth
    if (deployEnv === 'contract') {
        _epochTreeDepth = epochTreeDepth
    } else if (deployEnv === 'circuit') {
        _epochTreeDepth = circuitEpochTreeDepth
    } else {
        throw new Error('Only contract and circuit testing env are supported')
    }
    const defaultOTSMTHash = SMT_ONE_LEAF
    return genNewSMT(_epochTreeDepth, defaultOTSMTHash)
}

const genNewNullifierTree = async (deployEnv: string = "contract"): Promise<SparseMerkleTreeImpl> => {
    let _nullifierTreeDepth
    if (deployEnv === 'contract') {
        _nullifierTreeDepth = nullifierTreeDepth
    } else if (deployEnv === 'circuit') {
        _nullifierTreeDepth = circuitNullifierTreeDepth
    } else {
        throw new Error('Only contract and circuit testing env are supported')
    }
    const nullifierTree = await genNewSMT(_nullifierTreeDepth, SMT_ZERO_LEAF)
    // Reserve leaf 0
    await nullifierTree.update(BigInt(0), SMT_ONE_LEAF)
    return nullifierTree
}

const defaultUserStateLeaf = hash5([BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)])

const computeEmptyUserStateRoot = (treeDepth: number): BigInt => {
    const t = new IncrementalQuinTree(
        treeDepth,
        defaultUserStateLeaf,
        2,
    )
    return t.root
}    

const genNewUserStateTree = async (deployEnv: string = "contract"): Promise<SparseMerkleTreeImpl> => {
    let _userStateTreeDepth
    if (deployEnv === 'contract') {
        _userStateTreeDepth = userStateTreeDepth
    } else if (deployEnv === 'circuit') {
        _userStateTreeDepth = circuitUserStateTreeDepth
    } else {
        throw new Error('Only contract and circuit testing env are supported')
    }

    return genNewSMT(_userStateTreeDepth, defaultUserStateLeaf)
}

export {
    SMT_ONE_LEAF,
    SMT_ZERO_LEAF,
    computeEmptyUserStateRoot,
    computeNullifier,
    computeReputationHash,
    defaultUserStateLeaf,
    deployUnirep,
    getTreeDepthsForTesting,
    genEpochKey,
    genNoAttestationNullifierKey,
    genNewEpochTree,
    genNewNullifierTree,
    genNewUserStateTree,
    genNewSMT,
    toCompleteHexString,
}