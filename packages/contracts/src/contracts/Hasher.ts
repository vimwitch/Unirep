/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    PopulatedTransaction,
    Signer,
    utils,
} from 'ethers'
import { FunctionFragment, Result } from '@ethersproject/abi'
import { Listener, Provider } from '@ethersproject/providers'
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common'

export declare namespace UnirepTypes {
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

export interface HasherInterface extends utils.Interface {
    contractName: 'Hasher'
    functions: {
        'hashEpochKeyProof((uint256,uint256,uint256,uint256[8]))': FunctionFragment
        'hashProcessAttestationsProof(uint256,uint256,uint256,uint256[8])': FunctionFragment
        'hashReputationProof((uint256[],uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256[8]))': FunctionFragment
        'hashSignUpProof((uint256,uint256,uint256,uint256,uint256,uint256[8]))': FunctionFragment
        'hashStartTransitionProof(uint256,uint256,uint256,uint256[8])': FunctionFragment
        'hashUserStateTransitionProof((uint256,uint256[],uint256,uint256[],uint256,uint256[],uint256,uint256[8]))': FunctionFragment
    }

    encodeFunctionData(
        functionFragment: 'hashEpochKeyProof',
        values: [UnirepTypes.EpochKeyProofStruct]
    ): string
    encodeFunctionData(
        functionFragment: 'hashProcessAttestationsProof',
        values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish[]]
    ): string
    encodeFunctionData(
        functionFragment: 'hashReputationProof',
        values: [UnirepTypes.ReputationProofStruct]
    ): string
    encodeFunctionData(
        functionFragment: 'hashSignUpProof',
        values: [UnirepTypes.SignUpProofStruct]
    ): string
    encodeFunctionData(
        functionFragment: 'hashStartTransitionProof',
        values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish[]]
    ): string
    encodeFunctionData(
        functionFragment: 'hashUserStateTransitionProof',
        values: [UnirepTypes.UserTransitionProofStruct]
    ): string

    decodeFunctionResult(
        functionFragment: 'hashEpochKeyProof',
        data: BytesLike
    ): Result
    decodeFunctionResult(
        functionFragment: 'hashProcessAttestationsProof',
        data: BytesLike
    ): Result
    decodeFunctionResult(
        functionFragment: 'hashReputationProof',
        data: BytesLike
    ): Result
    decodeFunctionResult(
        functionFragment: 'hashSignUpProof',
        data: BytesLike
    ): Result
    decodeFunctionResult(
        functionFragment: 'hashStartTransitionProof',
        data: BytesLike
    ): Result
    decodeFunctionResult(
        functionFragment: 'hashUserStateTransitionProof',
        data: BytesLike
    ): Result

    events: {}
}

export interface Hasher extends BaseContract {
    contractName: 'Hasher'
    connect(signerOrProvider: Signer | Provider | string): this
    attach(addressOrName: string): this
    deployed(): Promise<this>

    interface: HasherInterface

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
        hashEpochKeyProof(
            input: UnirepTypes.EpochKeyProofStruct,
            overrides?: CallOverrides
        ): Promise<[string]>

        hashProcessAttestationsProof(
            outputBlindedUserState: BigNumberish,
            outputBlindedHashChain: BigNumberish,
            inputBlindedUserState: BigNumberish,
            proof: BigNumberish[],
            overrides?: CallOverrides
        ): Promise<[string]>

        hashReputationProof(
            input: UnirepTypes.ReputationProofStruct,
            overrides?: CallOverrides
        ): Promise<[string]>

        hashSignUpProof(
            input: UnirepTypes.SignUpProofStruct,
            overrides?: CallOverrides
        ): Promise<[string]>

        hashStartTransitionProof(
            blindedUserState: BigNumberish,
            blindedHashChain: BigNumberish,
            globalStateTree: BigNumberish,
            proof: BigNumberish[],
            overrides?: CallOverrides
        ): Promise<[string]>

        hashUserStateTransitionProof(
            input: UnirepTypes.UserTransitionProofStruct,
            overrides?: CallOverrides
        ): Promise<[string]>
    }

    hashEpochKeyProof(
        input: UnirepTypes.EpochKeyProofStruct,
        overrides?: CallOverrides
    ): Promise<string>

    hashProcessAttestationsProof(
        outputBlindedUserState: BigNumberish,
        outputBlindedHashChain: BigNumberish,
        inputBlindedUserState: BigNumberish,
        proof: BigNumberish[],
        overrides?: CallOverrides
    ): Promise<string>

    hashReputationProof(
        input: UnirepTypes.ReputationProofStruct,
        overrides?: CallOverrides
    ): Promise<string>

    hashSignUpProof(
        input: UnirepTypes.SignUpProofStruct,
        overrides?: CallOverrides
    ): Promise<string>

    hashStartTransitionProof(
        blindedUserState: BigNumberish,
        blindedHashChain: BigNumberish,
        globalStateTree: BigNumberish,
        proof: BigNumberish[],
        overrides?: CallOverrides
    ): Promise<string>

    hashUserStateTransitionProof(
        input: UnirepTypes.UserTransitionProofStruct,
        overrides?: CallOverrides
    ): Promise<string>

    callStatic: {
        hashEpochKeyProof(
            input: UnirepTypes.EpochKeyProofStruct,
            overrides?: CallOverrides
        ): Promise<string>

        hashProcessAttestationsProof(
            outputBlindedUserState: BigNumberish,
            outputBlindedHashChain: BigNumberish,
            inputBlindedUserState: BigNumberish,
            proof: BigNumberish[],
            overrides?: CallOverrides
        ): Promise<string>

        hashReputationProof(
            input: UnirepTypes.ReputationProofStruct,
            overrides?: CallOverrides
        ): Promise<string>

        hashSignUpProof(
            input: UnirepTypes.SignUpProofStruct,
            overrides?: CallOverrides
        ): Promise<string>

        hashStartTransitionProof(
            blindedUserState: BigNumberish,
            blindedHashChain: BigNumberish,
            globalStateTree: BigNumberish,
            proof: BigNumberish[],
            overrides?: CallOverrides
        ): Promise<string>

        hashUserStateTransitionProof(
            input: UnirepTypes.UserTransitionProofStruct,
            overrides?: CallOverrides
        ): Promise<string>
    }

    filters: {}

    estimateGas: {
        hashEpochKeyProof(
            input: UnirepTypes.EpochKeyProofStruct,
            overrides?: CallOverrides
        ): Promise<BigNumber>

        hashProcessAttestationsProof(
            outputBlindedUserState: BigNumberish,
            outputBlindedHashChain: BigNumberish,
            inputBlindedUserState: BigNumberish,
            proof: BigNumberish[],
            overrides?: CallOverrides
        ): Promise<BigNumber>

        hashReputationProof(
            input: UnirepTypes.ReputationProofStruct,
            overrides?: CallOverrides
        ): Promise<BigNumber>

        hashSignUpProof(
            input: UnirepTypes.SignUpProofStruct,
            overrides?: CallOverrides
        ): Promise<BigNumber>

        hashStartTransitionProof(
            blindedUserState: BigNumberish,
            blindedHashChain: BigNumberish,
            globalStateTree: BigNumberish,
            proof: BigNumberish[],
            overrides?: CallOverrides
        ): Promise<BigNumber>

        hashUserStateTransitionProof(
            input: UnirepTypes.UserTransitionProofStruct,
            overrides?: CallOverrides
        ): Promise<BigNumber>
    }

    populateTransaction: {
        hashEpochKeyProof(
            input: UnirepTypes.EpochKeyProofStruct,
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>

        hashProcessAttestationsProof(
            outputBlindedUserState: BigNumberish,
            outputBlindedHashChain: BigNumberish,
            inputBlindedUserState: BigNumberish,
            proof: BigNumberish[],
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>

        hashReputationProof(
            input: UnirepTypes.ReputationProofStruct,
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>

        hashSignUpProof(
            input: UnirepTypes.SignUpProofStruct,
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>

        hashStartTransitionProof(
            blindedUserState: BigNumberish,
            blindedHashChain: BigNumberish,
            globalStateTree: BigNumberish,
            proof: BigNumberish[],
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>

        hashUserStateTransitionProof(
            input: UnirepTypes.UserTransitionProofStruct,
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>
    }
}
