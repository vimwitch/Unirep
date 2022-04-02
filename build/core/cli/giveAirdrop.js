"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubparser = exports.giveAirdrop = void 0;
const base64url_1 = __importDefault(require("base64url"));
const contracts_1 = require("../../contracts");
const circuits_1 = require("../../circuits");
const defaults_1 = require("./defaults");
const verifyUserSignUpProof_1 = require("./verifyUserSignUpProof");
const prefix_1 = require("./prefix");
const utils_1 = require("./utils");
const ethers_1 = require("ethers");
const configureSubparser = (subparsers) => {
    const parser = subparsers.add_parser('giveAirdrop', { add_help: true });
    parser.add_argument('-e', '--eth-provider', {
        action: 'store',
        type: 'str',
        help: `A connection string to an Ethereum provider. Default: ${defaults_1.DEFAULT_ETH_PROVIDER}`,
    });
    parser.add_argument('-p', '--public-signals', {
        required: true,
        type: 'str',
        help: "The snark public signals of the user's epoch key ",
    });
    parser.add_argument('-pf', '--proof', {
        required: true,
        type: 'str',
        help: "The snark proof of the user's epoch key ",
    });
    parser.add_argument('-x', '--contract', {
        required: true,
        type: 'str',
        help: 'The Unirep contract address',
    });
    parser.add_argument('-d', '--eth-privkey', {
        action: 'store',
        type: 'str',
        help: "The attester's Ethereum private key",
    });
};
exports.configureSubparser = configureSubparser;
const giveAirdrop = async (args) => {
    // Ethereum provider
    const ethProvider = args.eth_provider
        ? args.eth_provider
        : defaults_1.DEFAULT_ETH_PROVIDER;
    const provider = (0, utils_1.getProvider)(ethProvider);
    // Unirep contract
    const unirepContract = contracts_1.UnirepFactory.connect(args.contract, provider);
    const attestingFee = await unirepContract.attestingFee();
    // Connect a signer
    const wallet = new ethers_1.ethers.Wallet(args.eth_privkey, provider);
    await (0, verifyUserSignUpProof_1.verifyUserSignUpProof)(args);
    // Parse input
    const decodedProof = base64url_1.default.decode(args.proof.slice(prefix_1.signUpProofPrefix.length));
    const proof = JSON.parse(decodedProof);
    const decodedPublicSignals = base64url_1.default.decode(args.public_signals.slice(prefix_1.signUpPublicSignalsPrefix.length));
    const publicSignals = JSON.parse(decodedPublicSignals);
    const userSignUpProof = new contracts_1.SignUpProof(publicSignals, (0, circuits_1.formatProofForSnarkjsVerification)(proof));
    console.log(`Airdrop to epoch key ${userSignUpProof.epochKey} in attester ID ${userSignUpProof.attesterId}`);
    // Submit attestation
    let tx;
    try {
        tx = await unirepContract
            .connect(wallet)
            .airdropEpochKey(userSignUpProof, { value: attestingFee });
        await tx.wait();
    }
    catch (error) {
        console.log('Transaction Error', error);
        return;
    }
    const hashProof = await unirepContract.hashSignUpProof(userSignUpProof);
    const proofIndex = await unirepContract.getProofIndex(hashProof);
    console.log('Transaction hash:', tx.hash);
    console.log('Proof index:', proofIndex.toNumber());
};
exports.giveAirdrop = giveAirdrop;
