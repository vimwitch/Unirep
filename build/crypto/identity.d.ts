/// <reference types="node" />
import { SnarkBigInt } from './crypto';
declare type EddsaPrivateKey = Buffer;
declare type EddsaPublicKey = SnarkBigInt[];
declare type SnarkWitness = Array<SnarkBigInt>;
declare type SnarkPublicSignals = SnarkBigInt[];
interface SnarkProof {
    pi_a: SnarkBigInt[];
    pi_b: SnarkBigInt[][];
    pi_c: SnarkBigInt[];
}
declare type SerializedIdentity = {
    identityNullifier: string;
    identityTrapdoor: string;
    secret: string[];
};
declare enum Strategy {
    RANDOM = 0,
    MESSAGE = 1,
    SERIALIZED = 2
}
/**
 * ZkIdentity is a class which can be used by protocols supported by the
 * @zk-key/protocols package and it simplifies the management of
 * identity-related witness parameters.
 */
export default class ZkIdentity {
    private _identityTrapdoor;
    private _identityNullifier;
    private _secret;
    /**
     * Initializes the class attributes based on the strategy passed as parameter.
     * @param strategy The strategy for identity generation.
     * @param metadata Additional data needed to create identity for given strategy.
     */
    constructor(strategy?: Strategy, metadata?: string | SerializedIdentity);
    /**
     * Returns the identity trapdoor.
     * @returns The identity trapdoor.
     */
    getTrapdoor(): bigint;
    /**
     * Returns the identity nullifier.
     * @returns The identity nullifier.
     */
    getNullifier(): bigint;
    /**
     * Returns the secret.
     * @returns The secret.
     */
    getSecret(): bigint[];
    /**
     * Returns the Poseidon hash of the secret.
     * @returns The hash of the secret.
     */
    getSecretHash(): bigint;
    /**
     * Generates the identity commitment from the secret.
     * @returns identity commitment
     */
    genIdentityCommitment(): bigint;
    /**
     * Serializes the class attributes and returns a stringified object.
     * @returns The stringified serialized identity.
     */
    serializeIdentity(): string;
}
export { EddsaPrivateKey, EddsaPublicKey, SnarkWitness, SnarkPublicSignals, SnarkProof, SnarkBigInt, ZkIdentity, Strategy, };
