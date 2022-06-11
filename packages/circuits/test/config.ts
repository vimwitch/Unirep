import path from 'path'
import { CircuitConfig } from '../src'

// the path to `.wasm`, `.vkey.json`, `.zkey` files that the circuits are built
export const exportBuildPath = path.join(__dirname, '../zksnarkBuild')

// make the test circuit size smaller
export const testConfig: CircuitConfig = {
    globalStateTreeDepth: 4,
    userStateTreeDepth: 4,
    epochTreeDepth: 4,
    numEpochKeyNoncePerEpoch: 3,
    maxReputationBudget: 5,
    numAttestationsPerProof: 5,
}

// config from the built files (`.wasm`, `.vkey.json`, `.zkey`)
// circom files end in `*_main.circom`
export const config = require(path.join(exportBuildPath, 'config.json'))
