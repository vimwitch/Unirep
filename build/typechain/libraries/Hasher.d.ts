import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "../common";
export declare namespace UnirepTypes {
    type EpochKeyProofStruct = {
        globalStateTree: BigNumberish;
        epoch: BigNumberish;
        epochKey: BigNumberish;
        proof: BigNumberish[];
    };
    type EpochKeyProofStructOutput = [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber[]
    ] & {
        globalStateTree: BigNumber;
        epoch: BigNumber;
        epochKey: BigNumber;
        proof: BigNumber[];
    };
    type ReputationProofStruct = {
        repNullifiers: BigNumberish[];
        epoch: BigNumberish;
        epochKey: BigNumberish;
        globalStateTree: BigNumberish;
        attesterId: BigNumberish;
        proveReputationAmount: BigNumberish;
        minRep: BigNumberish;
        proveGraffiti: BigNumberish;
        graffitiPreImage: BigNumberish;
        proof: BigNumberish[];
    };
    type ReputationProofStructOutput = [
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
        repNullifiers: BigNumber[];
        epoch: BigNumber;
        epochKey: BigNumber;
        globalStateTree: BigNumber;
        attesterId: BigNumber;
        proveReputationAmount: BigNumber;
        minRep: BigNumber;
        proveGraffiti: BigNumber;
        graffitiPreImage: BigNumber;
        proof: BigNumber[];
    };
    type SignUpProofStruct = {
        epoch: BigNumberish;
        epochKey: BigNumberish;
        globalStateTree: BigNumberish;
        attesterId: BigNumberish;
        userHasSignedUp: BigNumberish;
        proof: BigNumberish[];
    };
    type SignUpProofStructOutput = [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber[]
    ] & {
        epoch: BigNumber;
        epochKey: BigNumber;
        globalStateTree: BigNumber;
        attesterId: BigNumber;
        userHasSignedUp: BigNumber;
        proof: BigNumber[];
    };
    type UserTransitionProofStruct = {
        newGlobalStateTreeLeaf: BigNumberish;
        epkNullifiers: BigNumberish[];
        transitionFromEpoch: BigNumberish;
        blindedUserStates: BigNumberish[];
        fromGlobalStateTree: BigNumberish;
        blindedHashChains: BigNumberish[];
        fromEpochTree: BigNumberish;
        proof: BigNumberish[];
    };
    type UserTransitionProofStructOutput = [
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber[]
    ] & {
        newGlobalStateTreeLeaf: BigNumber;
        epkNullifiers: BigNumber[];
        transitionFromEpoch: BigNumber;
        blindedUserStates: BigNumber[];
        fromGlobalStateTree: BigNumber;
        blindedHashChains: BigNumber[];
        fromEpochTree: BigNumber;
        proof: BigNumber[];
    };
}
export interface HasherInterface extends utils.Interface {
    functions: {
        "hashEpochKeyProof((uint256,uint256,uint256,uint256[8]))": FunctionFragment;
        "hashProcessAttestationsProof(uint256,uint256,uint256,uint256[8])": FunctionFragment;
        "hashReputationProof((uint256[],uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256[8]))": FunctionFragment;
        "hashSignUpProof((uint256,uint256,uint256,uint256,uint256,uint256[8]))": FunctionFragment;
        "hashStartTransitionProof(uint256,uint256,uint256,uint256[8])": FunctionFragment;
        "hashUserStateTransitionProof((uint256,uint256[],uint256,uint256[],uint256,uint256[],uint256,uint256[8]))": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "hashEpochKeyProof" | "hashProcessAttestationsProof" | "hashReputationProof" | "hashSignUpProof" | "hashStartTransitionProof" | "hashUserStateTransitionProof"): FunctionFragment;
    encodeFunctionData(functionFragment: "hashEpochKeyProof", values: [UnirepTypes.EpochKeyProofStruct]): string;
    encodeFunctionData(functionFragment: "hashProcessAttestationsProof", values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "hashReputationProof", values: [UnirepTypes.ReputationProofStruct]): string;
    encodeFunctionData(functionFragment: "hashSignUpProof", values: [UnirepTypes.SignUpProofStruct]): string;
    encodeFunctionData(functionFragment: "hashStartTransitionProof", values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "hashUserStateTransitionProof", values: [UnirepTypes.UserTransitionProofStruct]): string;
    decodeFunctionResult(functionFragment: "hashEpochKeyProof", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashProcessAttestationsProof", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashReputationProof", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashSignUpProof", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashStartTransitionProof", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashUserStateTransitionProof", data: BytesLike): Result;
    events: {};
}
export interface Hasher extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: HasherInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        hashEpochKeyProof(_input: UnirepTypes.EpochKeyProofStruct, overrides?: CallOverrides): Promise<[string]>;
        hashProcessAttestationsProof(_outputBlindedUserState: BigNumberish, _outputBlindedHashChain: BigNumberish, _inputBlindedUserState: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<[string]>;
        hashReputationProof(_input: UnirepTypes.ReputationProofStruct, overrides?: CallOverrides): Promise<[string]>;
        hashSignUpProof(_input: UnirepTypes.SignUpProofStruct, overrides?: CallOverrides): Promise<[string]>;
        hashStartTransitionProof(_blindedUserState: BigNumberish, _blindedHashChain: BigNumberish, _globalStateTree: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<[string]>;
        hashUserStateTransitionProof(_input: UnirepTypes.UserTransitionProofStruct, overrides?: CallOverrides): Promise<[string]>;
    };
    hashEpochKeyProof(_input: UnirepTypes.EpochKeyProofStruct, overrides?: CallOverrides): Promise<string>;
    hashProcessAttestationsProof(_outputBlindedUserState: BigNumberish, _outputBlindedHashChain: BigNumberish, _inputBlindedUserState: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<string>;
    hashReputationProof(_input: UnirepTypes.ReputationProofStruct, overrides?: CallOverrides): Promise<string>;
    hashSignUpProof(_input: UnirepTypes.SignUpProofStruct, overrides?: CallOverrides): Promise<string>;
    hashStartTransitionProof(_blindedUserState: BigNumberish, _blindedHashChain: BigNumberish, _globalStateTree: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<string>;
    hashUserStateTransitionProof(_input: UnirepTypes.UserTransitionProofStruct, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        hashEpochKeyProof(_input: UnirepTypes.EpochKeyProofStruct, overrides?: CallOverrides): Promise<string>;
        hashProcessAttestationsProof(_outputBlindedUserState: BigNumberish, _outputBlindedHashChain: BigNumberish, _inputBlindedUserState: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<string>;
        hashReputationProof(_input: UnirepTypes.ReputationProofStruct, overrides?: CallOverrides): Promise<string>;
        hashSignUpProof(_input: UnirepTypes.SignUpProofStruct, overrides?: CallOverrides): Promise<string>;
        hashStartTransitionProof(_blindedUserState: BigNumberish, _blindedHashChain: BigNumberish, _globalStateTree: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<string>;
        hashUserStateTransitionProof(_input: UnirepTypes.UserTransitionProofStruct, overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        hashEpochKeyProof(_input: UnirepTypes.EpochKeyProofStruct, overrides?: CallOverrides): Promise<BigNumber>;
        hashProcessAttestationsProof(_outputBlindedUserState: BigNumberish, _outputBlindedHashChain: BigNumberish, _inputBlindedUserState: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<BigNumber>;
        hashReputationProof(_input: UnirepTypes.ReputationProofStruct, overrides?: CallOverrides): Promise<BigNumber>;
        hashSignUpProof(_input: UnirepTypes.SignUpProofStruct, overrides?: CallOverrides): Promise<BigNumber>;
        hashStartTransitionProof(_blindedUserState: BigNumberish, _blindedHashChain: BigNumberish, _globalStateTree: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<BigNumber>;
        hashUserStateTransitionProof(_input: UnirepTypes.UserTransitionProofStruct, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        hashEpochKeyProof(_input: UnirepTypes.EpochKeyProofStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hashProcessAttestationsProof(_outputBlindedUserState: BigNumberish, _outputBlindedHashChain: BigNumberish, _inputBlindedUserState: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hashReputationProof(_input: UnirepTypes.ReputationProofStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hashSignUpProof(_input: UnirepTypes.SignUpProofStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hashStartTransitionProof(_blindedUserState: BigNumberish, _blindedHashChain: BigNumberish, _globalStateTree: BigNumberish, _proof: BigNumberish[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hashUserStateTransitionProof(_input: UnirepTypes.UserTransitionProofStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
