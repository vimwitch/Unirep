/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    ContractTransaction,
    Overrides,
    PopulatedTransaction,
    Signer,
    utils,
} from 'ethers'
import { FunctionFragment, Result, EventFragment } from '@ethersproject/abi'
import { Listener, Provider } from '@ethersproject/providers'
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common'

export declare namespace UnirepTypes {
    export type AttestationStruct = {
        attesterId: BigNumberish
        posRep: BigNumberish
        negRep: BigNumberish
        graffiti: BigNumberish
        signUp: BigNumberish
    }

    export type AttestationStructOutput = [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        attesterId: BigNumber
        posRep: BigNumber
        negRep: BigNumber
        graffiti: BigNumber
        signUp: BigNumber
    }

    export type EpochKeyProofStruct = {
        globalStateTree: BigNumberish
        epoch: BigNumberish
        epochKey: BigNumberish
        proof: BigNumberish[]
    }

    export type EpochKeyProofStructOutput = [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber[]
    ] & {
        globalStateTree: BigNumber
        epoch: BigNumber
        epochKey: BigNumber
        proof: BigNumber[]
    }

    export type ReputationProofStruct = {
        repNullifiers: BigNumberish[]
        epoch: BigNumberish
        epochKey: BigNumberish
        globalStateTree: BigNumberish
        attesterId: BigNumberish
        proveReputationAmount: BigNumberish
        minRep: BigNumberish
        proveGraffiti: BigNumberish
        graffitiPreImage: BigNumberish
        proof: BigNumberish[]
    }

    export type ReputationProofStructOutput = [
        BigNumber[],
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber[]
    ] & {
        repNullifiers: BigNumber[]
        epoch: BigNumber
        epochKey: BigNumber
        globalStateTree: BigNumber
        attesterId: BigNumber
        proveReputationAmount: BigNumber
        minRep: BigNumber
        proveGraffiti: BigNumber
        graffitiPreImage: BigNumber
        proof: BigNumber[]
    }

    export type SignUpProofStruct = {
        epoch: BigNumberish
        epochKey: BigNumberish
        globalStateTree: BigNumberish
        attesterId: BigNumberish
        userHasSignedUp: BigNumberish
        proof: BigNumberish[]
    }

    export type SignUpProofStructOutput = [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber[]
    ] & {
        epoch: BigNumber
        epochKey: BigNumber
        globalStateTree: BigNumber
        attesterId: BigNumber
        userHasSignedUp: BigNumber
        proof: BigNumber[]
    }

    export type UserTransitionProofStruct = {
        newGlobalStateTreeLeaf: BigNumberish
        epkNullifiers: BigNumberish[]
        transitionFromEpoch: BigNumberish
        blindedUserStates: BigNumberish[]
        fromGlobalStateTree: BigNumberish
        blindedHashChains: BigNumberish[]
        fromEpochTree: BigNumberish
        proof: BigNumberish[]
    }

    export type UserTransitionProofStructOutput = [
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber[]
    ] & {
        newGlobalStateTreeLeaf: BigNumber
        epkNullifiers: BigNumber[]
        transitionFromEpoch: BigNumber
        blindedUserStates: BigNumber[]
        fromGlobalStateTree: BigNumber
        blindedHashChains: BigNumber[]
        fromEpochTree: BigNumber
        proof: BigNumber[]
    }
}

export interface IUnirepInterface extends utils.Interface {
    contractName: 'IUnirep'
    functions: {
        'attesterSignUp()': FunctionFragment
        'attesterSignUpViaRelayer(address,bytes)': FunctionFragment
    }

    encodeFunctionData(
        functionFragment: 'attesterSignUp',
        values?: undefined
    ): string
    encodeFunctionData(
        functionFragment: 'attesterSignUpViaRelayer',
        values: [string, BytesLike]
    ): string

    decodeFunctionResult(
        functionFragment: 'attesterSignUp',
        data: BytesLike
    ): Result
    decodeFunctionResult(
        functionFragment: 'attesterSignUpViaRelayer',
        data: BytesLike
    ): Result

    events: {
        'AttestationSubmitted(uint256,uint256,address,uint8,tuple,uint256,uint256)': EventFragment
        'EpochEnded(uint256)': EventFragment
        'IndexedEpochKeyProof(uint256,uint256,uint256,tuple)': EventFragment
        'IndexedProcessedAttestationsProof(uint256,uint256,uint256,uint256,uint256[8])': EventFragment
        'IndexedReputationProof(uint256,uint256,uint256,tuple)': EventFragment
        'IndexedStartedTransitionProof(uint256,uint256,uint256,uint256,uint256[8])': EventFragment
        'IndexedUserSignedUpProof(uint256,uint256,uint256,tuple)': EventFragment
        'IndexedUserStateTransitionProof(uint256,tuple,uint256[])': EventFragment
        'Sequencer(uint256,uint8)': EventFragment
        'UserSignedUp(uint256,uint256,uint256,uint256)': EventFragment
        'UserStateTransitioned(uint256,uint256,uint256)': EventFragment
    }

    getEvent(nameOrSignatureOrTopic: 'AttestationSubmitted'): EventFragment
    getEvent(nameOrSignatureOrTopic: 'EpochEnded'): EventFragment
    getEvent(nameOrSignatureOrTopic: 'IndexedEpochKeyProof'): EventFragment
    getEvent(
        nameOrSignatureOrTopic: 'IndexedProcessedAttestationsProof'
    ): EventFragment
    getEvent(nameOrSignatureOrTopic: 'IndexedReputationProof'): EventFragment
    getEvent(
        nameOrSignatureOrTopic: 'IndexedStartedTransitionProof'
    ): EventFragment
    getEvent(nameOrSignatureOrTopic: 'IndexedUserSignedUpProof'): EventFragment
    getEvent(
        nameOrSignatureOrTopic: 'IndexedUserStateTransitionProof'
    ): EventFragment
    getEvent(nameOrSignatureOrTopic: 'Sequencer'): EventFragment
    getEvent(nameOrSignatureOrTopic: 'UserSignedUp'): EventFragment
    getEvent(nameOrSignatureOrTopic: 'UserStateTransitioned'): EventFragment
}

export type AttestationSubmittedEvent = TypedEvent<
    [
        BigNumber,
        BigNumber,
        string,
        number,
        UnirepTypes.AttestationStructOutput,
        BigNumber,
        BigNumber
    ],
    {
        epoch: BigNumber
        epochKey: BigNumber
        attester: string
        attestationEvent: number
        attestation: UnirepTypes.AttestationStructOutput
        toProofIndex: BigNumber
        fromProofIndex: BigNumber
    }
>

export type AttestationSubmittedEventFilter =
    TypedEventFilter<AttestationSubmittedEvent>

export type EpochEndedEvent = TypedEvent<[BigNumber], { epoch: BigNumber }>

export type EpochEndedEventFilter = TypedEventFilter<EpochEndedEvent>

export type IndexedEpochKeyProofEvent = TypedEvent<
    [BigNumber, BigNumber, BigNumber, UnirepTypes.EpochKeyProofStructOutput],
    {
        proofIndex: BigNumber
        epoch: BigNumber
        epochKey: BigNumber
        proof: UnirepTypes.EpochKeyProofStructOutput
    }
>

export type IndexedEpochKeyProofEventFilter =
    TypedEventFilter<IndexedEpochKeyProofEvent>

export type IndexedProcessedAttestationsProofEvent = TypedEvent<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber[]],
    {
        proofIndex: BigNumber
        inputBlindedUserState: BigNumber
        outputBlindedUserState: BigNumber
        outputBlindedHashChain: BigNumber
        proof: BigNumber[]
    }
>

export type IndexedProcessedAttestationsProofEventFilter =
    TypedEventFilter<IndexedProcessedAttestationsProofEvent>

export type IndexedReputationProofEvent = TypedEvent<
    [BigNumber, BigNumber, BigNumber, UnirepTypes.ReputationProofStructOutput],
    {
        proofIndex: BigNumber
        epoch: BigNumber
        epochKey: BigNumber
        proof: UnirepTypes.ReputationProofStructOutput
    }
>

export type IndexedReputationProofEventFilter =
    TypedEventFilter<IndexedReputationProofEvent>

export type IndexedStartedTransitionProofEvent = TypedEvent<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber[]],
    {
        proofIndex: BigNumber
        blindedUserState: BigNumber
        globalStateTree: BigNumber
        blindedHashChain: BigNumber
        proof: BigNumber[]
    }
>

export type IndexedStartedTransitionProofEventFilter =
    TypedEventFilter<IndexedStartedTransitionProofEvent>

export type IndexedUserSignedUpProofEvent = TypedEvent<
    [BigNumber, BigNumber, BigNumber, UnirepTypes.SignUpProofStructOutput],
    {
        proofIndex: BigNumber
        epoch: BigNumber
        epochKey: BigNumber
        proof: UnirepTypes.SignUpProofStructOutput
    }
>

export type IndexedUserSignedUpProofEventFilter =
    TypedEventFilter<IndexedUserSignedUpProofEvent>

export type IndexedUserStateTransitionProofEvent = TypedEvent<
    [BigNumber, UnirepTypes.UserTransitionProofStructOutput, BigNumber[]],
    {
        proofIndex: BigNumber
        proof: UnirepTypes.UserTransitionProofStructOutput
        proofIndexRecords: BigNumber[]
    }
>

export type IndexedUserStateTransitionProofEventFilter =
    TypedEventFilter<IndexedUserStateTransitionProofEvent>

export type SequencerEvent = TypedEvent<
    [BigNumber, number],
    { epoch: BigNumber; userEvent: number }
>

export type SequencerEventFilter = TypedEventFilter<SequencerEvent>

export type UserSignedUpEvent = TypedEvent<
    [BigNumber, BigNumber, BigNumber, BigNumber],
    {
        epoch: BigNumber
        identityCommitment: BigNumber
        attesterId: BigNumber
        airdropAmount: BigNumber
    }
>

export type UserSignedUpEventFilter = TypedEventFilter<UserSignedUpEvent>

export type UserStateTransitionedEvent = TypedEvent<
    [BigNumber, BigNumber, BigNumber],
    { epoch: BigNumber; hashedLeaf: BigNumber; proofIndex: BigNumber }
>

export type UserStateTransitionedEventFilter =
    TypedEventFilter<UserStateTransitionedEvent>

export interface IUnirep extends BaseContract {
    contractName: 'IUnirep'
    connect(signerOrProvider: Signer | Provider | string): this
    attach(addressOrName: string): this
    deployed(): Promise<this>

    interface: IUnirepInterface

    queryFilter<TEvent extends TypedEvent>(
        event: TypedEventFilter<TEvent>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined
    ): Promise<Array<TEvent>>

    listeners<TEvent extends TypedEvent>(
        eventFilter?: TypedEventFilter<TEvent>
    ): Array<TypedListener<TEvent>>
    listeners(eventName?: string): Array<Listener>
    removeAllListeners<TEvent extends TypedEvent>(
        eventFilter: TypedEventFilter<TEvent>
    ): this
    removeAllListeners(eventName?: string): this
    off: OnEvent<this>
    on: OnEvent<this>
    once: OnEvent<this>
    removeListener: OnEvent<this>

    functions: {
        attesterSignUp(
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        attesterSignUpViaRelayer(
            attester: string,
            signature: BytesLike,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>
    }

    attesterSignUp(
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    attesterSignUpViaRelayer(
        attester: string,
        signature: BytesLike,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    callStatic: {
        attesterSignUp(overrides?: CallOverrides): Promise<void>

        attesterSignUpViaRelayer(
            attester: string,
            signature: BytesLike,
            overrides?: CallOverrides
        ): Promise<void>
    }

    filters: {
        'AttestationSubmitted(uint256,uint256,address,uint8,tuple,uint256,uint256)'(
            epoch?: BigNumberish | null,
            epochKey?: BigNumberish | null,
            attester?: string | null,
            attestationEvent?: null,
            attestation?: null,
            toProofIndex?: null,
            fromProofIndex?: null
        ): AttestationSubmittedEventFilter
        AttestationSubmitted(
            epoch?: BigNumberish | null,
            epochKey?: BigNumberish | null,
            attester?: string | null,
            attestationEvent?: null,
            attestation?: null,
            toProofIndex?: null,
            fromProofIndex?: null
        ): AttestationSubmittedEventFilter

        'EpochEnded(uint256)'(
            epoch?: BigNumberish | null
        ): EpochEndedEventFilter
        EpochEnded(epoch?: BigNumberish | null): EpochEndedEventFilter

        'IndexedEpochKeyProof(uint256,uint256,uint256,tuple)'(
            proofIndex?: BigNumberish | null,
            epoch?: BigNumberish | null,
            epochKey?: BigNumberish | null,
            proof?: null
        ): IndexedEpochKeyProofEventFilter
        IndexedEpochKeyProof(
            proofIndex?: BigNumberish | null,
            epoch?: BigNumberish | null,
            epochKey?: BigNumberish | null,
            proof?: null
        ): IndexedEpochKeyProofEventFilter

        'IndexedProcessedAttestationsProof(uint256,uint256,uint256,uint256,uint256[8])'(
            proofIndex?: BigNumberish | null,
            inputBlindedUserState?: BigNumberish | null,
            outputBlindedUserState?: null,
            outputBlindedHashChain?: null,
            proof?: null
        ): IndexedProcessedAttestationsProofEventFilter
        IndexedProcessedAttestationsProof(
            proofIndex?: BigNumberish | null,
            inputBlindedUserState?: BigNumberish | null,
            outputBlindedUserState?: null,
            outputBlindedHashChain?: null,
            proof?: null
        ): IndexedProcessedAttestationsProofEventFilter

        'IndexedReputationProof(uint256,uint256,uint256,tuple)'(
            proofIndex?: BigNumberish | null,
            epoch?: BigNumberish | null,
            epochKey?: BigNumberish | null,
            proof?: null
        ): IndexedReputationProofEventFilter
        IndexedReputationProof(
            proofIndex?: BigNumberish | null,
            epoch?: BigNumberish | null,
            epochKey?: BigNumberish | null,
            proof?: null
        ): IndexedReputationProofEventFilter

        'IndexedStartedTransitionProof(uint256,uint256,uint256,uint256,uint256[8])'(
            proofIndex?: BigNumberish | null,
            blindedUserState?: BigNumberish | null,
            globalStateTree?: BigNumberish | null,
            blindedHashChain?: null,
            proof?: null
        ): IndexedStartedTransitionProofEventFilter
        IndexedStartedTransitionProof(
            proofIndex?: BigNumberish | null,
            blindedUserState?: BigNumberish | null,
            globalStateTree?: BigNumberish | null,
            blindedHashChain?: null,
            proof?: null
        ): IndexedStartedTransitionProofEventFilter

        'IndexedUserSignedUpProof(uint256,uint256,uint256,tuple)'(
            proofIndex?: BigNumberish | null,
            epoch?: BigNumberish | null,
            epochKey?: BigNumberish | null,
            proof?: null
        ): IndexedUserSignedUpProofEventFilter
        IndexedUserSignedUpProof(
            proofIndex?: BigNumberish | null,
            epoch?: BigNumberish | null,
            epochKey?: BigNumberish | null,
            proof?: null
        ): IndexedUserSignedUpProofEventFilter

        'IndexedUserStateTransitionProof(uint256,tuple,uint256[])'(
            proofIndex?: BigNumberish | null,
            proof?: null,
            proofIndexRecords?: null
        ): IndexedUserStateTransitionProofEventFilter
        IndexedUserStateTransitionProof(
            proofIndex?: BigNumberish | null,
            proof?: null,
            proofIndexRecords?: null
        ): IndexedUserStateTransitionProofEventFilter

        'Sequencer(uint256,uint8)'(
            epoch?: BigNumberish | null,
            userEvent?: null
        ): SequencerEventFilter
        Sequencer(
            epoch?: BigNumberish | null,
            userEvent?: null
        ): SequencerEventFilter

        'UserSignedUp(uint256,uint256,uint256,uint256)'(
            epoch?: BigNumberish | null,
            identityCommitment?: BigNumberish | null,
            attesterId?: null,
            airdropAmount?: null
        ): UserSignedUpEventFilter
        UserSignedUp(
            epoch?: BigNumberish | null,
            identityCommitment?: BigNumberish | null,
            attesterId?: null,
            airdropAmount?: null
        ): UserSignedUpEventFilter

        'UserStateTransitioned(uint256,uint256,uint256)'(
            epoch?: BigNumberish | null,
            hashedLeaf?: BigNumberish | null,
            proofIndex?: null
        ): UserStateTransitionedEventFilter
        UserStateTransitioned(
            epoch?: BigNumberish | null,
            hashedLeaf?: BigNumberish | null,
            proofIndex?: null
        ): UserStateTransitionedEventFilter
    }

    estimateGas: {
        attesterSignUp(
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        attesterSignUpViaRelayer(
            attester: string,
            signature: BytesLike,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>
    }

    populateTransaction: {
        attesterSignUp(
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        attesterSignUpViaRelayer(
            attester: string,
            signature: BytesLike,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>
    }
}
