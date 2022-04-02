"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubparser = exports.genUserSignUpProof = void 0;
const base64url_1 = __importDefault(require("base64url"));
const crypto_1 = require("../../crypto");
const circuits_1 = require("../../circuits");
const defaults_1 = require("./defaults");
const src_1 = require("../src");
const prefix_1 = require("./prefix");
const utils_1 = require("./utils");
const configureSubparser = (subparsers) => {
    const parser = subparsers.add_parser('genUserSignUpProof', {
        add_help: true,
    });
    parser.add_argument('-e', '--eth-provider', {
        action: 'store',
        type: 'str',
        help: `A connection string to an Ethereum provider. Default: ${defaults_1.DEFAULT_ETH_PROVIDER}`,
    });
    parser.add_argument('-id', '--identity', {
        required: true,
        type: 'str',
        help: "The (serialized) user's identity",
    });
    parser.add_argument('-a', '--attester-id', {
        required: true,
        type: 'str',
        help: 'The attester id (in hex representation)',
    });
    parser.add_argument('-x', '--contract', {
        required: true,
        type: 'str',
        help: 'The Unirep contract address',
    });
};
exports.configureSubparser = configureSubparser;
const genUserSignUpProof = async (args) => {
    // Ethereum provider
    const ethProvider = args.eth_provider
        ? args.eth_provider
        : defaults_1.DEFAULT_ETH_PROVIDER;
    const provider = (0, utils_1.getProvider)(ethProvider);
    const encodedIdentity = args.identity.slice(prefix_1.identityPrefix.length);
    const decodedIdentity = base64url_1.default.decode(encodedIdentity);
    const id = new crypto_1.ZkIdentity(crypto_1.Strategy.SERIALIZED, decodedIdentity);
    // Gen user sign up proof
    const userState = await (0, src_1.genUserStateFromContract)(provider, args.contract, id);
    const attesterId = BigInt(args.attester_id);
    const results = await userState.genUserSignUpProof(attesterId);
    // TODO: Not sure if this validation is necessary
    const isValid = await (0, circuits_1.verifyProof)(circuits_1.Circuit.proveUserSignUp, results.proof, results.publicSignals);
    if (!isValid) {
        console.error('Error: user sign up proof generated is not valid!');
        return;
    }
    const formattedProof = (0, circuits_1.formatProofForVerifierContract)(results.proof);
    const encodedProof = base64url_1.default.encode(JSON.stringify(formattedProof));
    const encodedPublicSignals = base64url_1.default.encode(JSON.stringify(results.publicSignals));
    console.log(`Proof of user sign up from attester ${results.attesterId}:`);
    console.log(`Epoch key of the user: ${BigInt(results.epochKey).toString()}`);
    console.log(prefix_1.signUpProofPrefix + encodedProof);
    console.log(prefix_1.signUpPublicSignalsPrefix + encodedPublicSignals);
};
exports.genUserSignUpProof = genUserSignUpProof;
