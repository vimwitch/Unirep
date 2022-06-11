export enum CircuitName {
    VerifyEpochKey = 'verifyEpochKey',
    ProveReputation = 'proveReputation',
    ProveUserSignUp = 'proveUserSignUp',
    StartTransition = 'startTransition',
    ProcessAttestations = 'processAttestations',
    UserStateTransition = 'userStateTransition',
}

export type CircuitConfig = {
    globalStateTreeDepth: number
    userStateTreeDepth: number
    epochTreeDepth: number
    numAttestationsPerProof: number
    maxReputationBudget: number
    numEpochKeyNoncePerEpoch: number
}
