import path from 'path'
import { CircuitConfig } from '../src'

export const config: CircuitConfig = {
    globalStateTreeDepth: 4,
    userStateTreeDepth: 4,
    epochTreeDepth: 32,
    numEpochKeyNoncePerEpoch: 3,
    maxReputationBudget: 10,
    numAttestationsPerProof: 5,
}

// the path to `.wasm`, `.vkey.json`, `.zkey` files that the circuits are built, and it includes `.circom` files that contains main() and their `config.json`
export const exportBuildPath = path.join(__dirname, '../zksnarkBuild')

// the path to the output ptau
export const ptau = path.join(
    exportBuildPath,
    'powersOfTau28_hez_final_17.ptau'
)

// the url of the ptau
export const ptauUrl =
    'https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_17.ptau'

// the flag to indicate whether to overwrite circuits
export const overrideCircuit = false
