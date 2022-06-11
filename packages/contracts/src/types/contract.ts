import { CircuitConfig, CircuitName } from './circuit'

export type ContractConfig = {
    attestingFee: string
    epochLength: number
    maxUsers: number
    maxAttesters: number
} & CircuitConfig

// address of deployed verifiers
type EnumDictionary<T extends string, U> = {
    [K in T]: U
}
export const addressMap: EnumDictionary<CircuitName, string | undefined> = {
    [CircuitName.VerifyEpochKey]: undefined,
    [CircuitName.ProveReputation]: undefined,
    [CircuitName.ProveUserSignUp]: undefined,
    [CircuitName.StartTransition]: undefined,
    [CircuitName.ProcessAttestations]: undefined,
    [CircuitName.UserStateTransition]: undefined,
}

/**
 * Defined in ../contracts/interfaces/IUnirep.sol
 */
export enum UnirepEvent {
    UserSignedUp,
    UserStateTransitioned,
    AttestationSubmitted,
    EpochEnded,
}

export enum AttestationEvent {
    SendAttestation,
    Airdrop,
    SpendReputation,
}
