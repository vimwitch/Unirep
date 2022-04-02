"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubparser = exports.userSignUp = void 0;
const ethers_1 = require("ethers");
const base64url_1 = __importDefault(require("base64url"));
const contracts_1 = require("../../contracts");
const defaults_1 = require("./defaults");
const prefix_1 = require("./prefix");
const utils_1 = require("./utils");
const configureSubparser = (subparsers) => {
    const parser = subparsers.add_parser('userSignUp', { add_help: true });
    parser.add_argument('-e', '--eth-provider', {
        action: 'store',
        type: 'str',
        help: `A connection string to an Ethereum provider. Default: ${defaults_1.DEFAULT_ETH_PROVIDER}`,
    });
    parser.add_argument('-c', '--identity-commitment', {
        required: true,
        type: 'str',
        help: "The user's identity commitment (in hex representation)",
    });
    parser.add_argument('-x', '--contract', {
        required: true,
        type: 'str',
        help: 'The Unirep contract address',
    });
    parser.add_argument('-d', '--eth-privkey', {
        action: 'store',
        type: 'str',
        help: "The user's Ethereum private key",
    });
};
exports.configureSubparser = configureSubparser;
const userSignUp = async (args) => {
    // Ethereum provider
    const ethProvider = args.eth_provider
        ? args.eth_provider
        : defaults_1.DEFAULT_ETH_PROVIDER;
    const provider = (0, utils_1.getProvider)(ethProvider);
    // Unirep contract
    const unirepContract = contracts_1.UnirepFactory.connect(args.contract, provider);
    // Connect a signer
    const wallet = new ethers_1.ethers.Wallet(args.eth_privkey, provider);
    // Parse identity commitment
    const encodedCommitment = args.identity_commitment.slice(prefix_1.identityCommitmentPrefix.length);
    const decodedCommitment = base64url_1.default.decode(encodedCommitment);
    const commitment = decodedCommitment;
    // Submit the user sign up transaction
    let tx;
    try {
        tx = await unirepContract.connect(wallet).userSignUp(BigInt(commitment));
        await tx.wait();
    }
    catch (error) {
        console.log('Transaction Error', error);
        return;
    }
    const epoch = await unirepContract.currentEpoch();
    console.log('Transaction hash:', tx.hash);
    console.log('Sign up epoch:', epoch.toString());
};
exports.userSignUp = userSignUp;
