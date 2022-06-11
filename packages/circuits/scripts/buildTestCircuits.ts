import * as fs from 'fs'
import * as path from 'path'

import { exportBuildPath, testConfig } from '../test/config'

const buildEpochKeyExistsCircuit = (dirPath: string) => {
    const circomPath = path.join(dirPath, `epochKeyExists_test.circom`)
    const circuitContent = `
        include "../circuits/userStateTransition.circom"
        component main = EpochKeyExist(${testConfig.epochTreeDepth});
    `
    fs.writeFileSync(circomPath, circuitContent)
}

const buildHash5Circuit = (dirPath: string) => {
    const circomPath = path.join(dirPath, `hasher5_test.circom`)
    const circuitContent = `
        include "../circuits/hasherPoseidon.circom"
        component main = Hasher5();
    `
    fs.writeFileSync(circomPath, circuitContent)
}

const buildHashLeftRightCircuit = (dirPath: string) => {
    const circomPath = path.join(dirPath, `hashleftright_test.circom`)
    const circuitContent = `
        include "../circuits/hasherPoseidon.circom"
        component main = HashLeftRight();
    `
    fs.writeFileSync(circomPath, circuitContent)
}

const buildIdCommitmentCircuit = (dirPath: string) => {
    const circomPath = path.join(dirPath, `identityCommitment_test.circom`)
    const circuitContent = `
        include "../circuits/identityCommitment.circom"
        component main = IdentityCommitment();
    `
    fs.writeFileSync(circomPath, circuitContent)
}

const buildMerkleTreeInclusionProofCircuit = (dirPath: string) => {
    const circomPath = path.join(
        dirPath,
        `merkleTreeInclusionProof_test.circom`
    )
    const circuitContent = `
        include "../circuits/incrementalMerkleTree.circom"
        component main = MerkleTreeInclusionProof(${testConfig.globalStateTreeDepth});
    `
    fs.writeFileSync(circomPath, circuitContent)
}

const buildMerkleTreeLeafExistsCircuit = (dirPath: string) => {
    const circomPath = path.join(dirPath, `merkleTreeLeafExists_test.circom`)
    const circuitContent = `
        include "../circuits/incrementalMerkleTree.circom"
        component main = LeafExists(${testConfig.globalStateTreeDepth});
    `
    fs.writeFileSync(circomPath, circuitContent)
}

const buildSMTInclustionProofCircuit = (dirPath: string) => {
    const circomPath = path.join(dirPath, `smtInclusionProof_test.circom`)
    const circuitContent = `
        include "../circuits/sparseMerkleTree.circom"
        component main = SMTInclusionProof(${testConfig.epochTreeDepth});
    `
    fs.writeFileSync(circomPath, circuitContent)
}

const buildSMTLeafExistsCircuit = (dirPath: string) => {
    const circomPath = path.join(dirPath, `smtLeafExists_test.circom`)
    const circuitContent = `
        include "../circuits/sparseMerkleTree.circom"
        component main = SMTLeafExists(${testConfig.epochTreeDepth});
    `
    fs.writeFileSync(circomPath, circuitContent)
}

const buildVerifyHashChainCircuit = (dirPath: string) => {
    const circomPath = path.join(dirPath, `verifyHashChain_test.circom`)
    const circuitContent = `
        include "../circuits/verifyHashChain.circom"
        component main = VerifyHashChain(${testConfig.numAttestationsPerProof});
    `
    fs.writeFileSync(circomPath, circuitContent)
}

const main = async (): Promise<number> => {
    const dirPath = exportBuildPath
    const configPath = path.join(dirPath, 'testConfig.json')

    // build export zk files folder
    try {
        fs.mkdirSync(dirPath, { recursive: true })
    } catch (e) {
        console.log('Cannot create folder ', e)
    }

    buildEpochKeyExistsCircuit(dirPath)
    buildHash5Circuit(dirPath)
    buildHashLeftRightCircuit(dirPath)
    buildIdCommitmentCircuit(dirPath)
    buildMerkleTreeInclusionProofCircuit(dirPath)
    buildMerkleTreeLeafExistsCircuit(dirPath)
    buildSMTInclustionProofCircuit(dirPath)
    buildSMTLeafExistsCircuit(dirPath)
    buildVerifyHashChainCircuit(dirPath)

    fs.writeFileSync(configPath, JSON.stringify(testConfig))
    return 0
}

void (async () => {
    let exitCode
    try {
        exitCode = await main()
    } catch (err) {
        console.error(err)
        exitCode = 1
    }
    process.exit(exitCode)
})()
