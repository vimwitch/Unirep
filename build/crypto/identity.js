"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = exports.ZkIdentity = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const random_1 = require("@ethersproject/random");
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const circomlibjs_1 = require("circomlibjs");
/**
 * Returns an hexadecimal sha256 hash of the message passed as parameter.
 * @param message The string to hash.
 * @returns The hexadecimal hash of the message.
 */
function sha256(message) {
    const hash = (0, sha256_1.default)(message);
    return hash.toString();
}
/**
 * Generates a random big number.
 * @param numberOfBytes The number of bytes of the number.
 * @returns The generated random number.
 */
function genRandomNumber(numberOfBytes = 31) {
    return bignumber_1.BigNumber.from((0, random_1.randomBytes)(numberOfBytes)).toBigInt();
}
// The strategy used to generate the ZK identity.
var Strategy;
(function (Strategy) {
    Strategy[Strategy["RANDOM"] = 0] = "RANDOM";
    Strategy[Strategy["MESSAGE"] = 1] = "MESSAGE";
    Strategy[Strategy["SERIALIZED"] = 2] = "SERIALIZED";
})(Strategy || (Strategy = {}));
exports.Strategy = Strategy;
/**
 * ZkIdentity is a class which can be used by protocols supported by the
 * @zk-key/protocols package and it simplifies the management of
 * identity-related witness parameters.
 */
class ZkIdentity {
    /**
     * Initializes the class attributes based on the strategy passed as parameter.
     * @param strategy The strategy for identity generation.
     * @param metadata Additional data needed to create identity for given strategy.
     */
    constructor(strategy = Strategy.RANDOM, metadata) {
        this._secret = [];
        switch (strategy) {
            case Strategy.RANDOM: {
                this._identityTrapdoor = genRandomNumber();
                this._identityNullifier = genRandomNumber();
                this._secret = [this._identityNullifier, this._identityTrapdoor];
                break;
            }
            case Strategy.MESSAGE: {
                if (!metadata) {
                    throw new Error('The message is not defined');
                }
                if (typeof metadata !== 'string') {
                    throw new Error('The message is not a string');
                }
                const messageHash = sha256(metadata);
                this._identityTrapdoor = bignumber_1.BigNumber.from(`0x${sha256(`${messageHash}identity_trapdoor`)}`).toBigInt();
                this._identityNullifier = bignumber_1.BigNumber.from(`0x${sha256(`${messageHash}identity_nullifier`)}`).toBigInt();
                this._secret = [this._identityNullifier, this._identityTrapdoor];
                break;
            }
            case Strategy.SERIALIZED: {
                if (!metadata) {
                    throw new Error('The serialized identity is not defined');
                }
                if (typeof metadata === 'string') {
                    try {
                        metadata = JSON.parse(metadata);
                    }
                    catch (error) {
                        throw new Error('The serialized identity cannot be parsed');
                    }
                }
                if (!('identityNullifier' in metadata) ||
                    !('identityTrapdoor' in metadata) ||
                    !('secret' in metadata)) {
                    throw new Error('The serialized identity does not contain the right parameter');
                }
                const { identityNullifier, identityTrapdoor, secret } = metadata;
                this._identityNullifier = bignumber_1.BigNumber.from(`0x${identityNullifier}`).toBigInt();
                this._identityTrapdoor = bignumber_1.BigNumber.from(`0x${identityTrapdoor}`).toBigInt();
                this._secret = secret.map((item) => bignumber_1.BigNumber.from(`0x${item}`).toBigInt());
                break;
            }
            default:
                throw new Error('The provided strategy is not supported');
        }
    }
    /**
     * Returns the identity trapdoor.
     * @returns The identity trapdoor.
     */
    getTrapdoor() {
        return this._identityTrapdoor;
    }
    /**
     * Returns the identity nullifier.
     * @returns The identity nullifier.
     */
    getNullifier() {
        return this._identityNullifier;
    }
    /**
     * Returns the secret.
     * @returns The secret.
     */
    getSecret() {
        return this._secret;
    }
    /**
     * Returns the Poseidon hash of the secret.
     * @returns The hash of the secret.
     */
    getSecretHash() {
        return (0, circomlibjs_1.poseidon)(this._secret);
    }
    /**
     * Generates the identity commitment from the secret.
     * @returns identity commitment
     */
    genIdentityCommitment() {
        return (0, circomlibjs_1.poseidon)([this.getSecretHash()]);
    }
    /**
     * Serializes the class attributes and returns a stringified object.
     * @returns The stringified serialized identity.
     */
    serializeIdentity() {
        const data = {
            identityNullifier: this._identityNullifier.toString(16),
            identityTrapdoor: this._identityTrapdoor.toString(16),
            secret: this._secret.map((item) => item.toString(16)),
        };
        return JSON.stringify(data);
    }
}
exports.default = ZkIdentity;
exports.ZkIdentity = ZkIdentity;
