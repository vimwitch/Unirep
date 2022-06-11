import path from 'path'

import { CircuitConfig } from '../src/types/circuit'
import { ContractConfig } from '../src/types/contract'

export const zkFilesPath = path.join(__dirname, '../../circuits/zksnarkBuild')
export const verifiersPath = path.join(__dirname, '../contracts/verifiers')
export const artifactsPath = path.join(__dirname, '../build/artifacts')
export const circuitConfig: CircuitConfig = require(path.join(
    zkFilesPath,
    'config.json'
))
export const contractConfig: ContractConfig = {
    attestingFee: '0.1',
    epochLength: 30,
    maxUsers: 10,
    maxAttesters: 10,
    ...circuitConfig,
}
