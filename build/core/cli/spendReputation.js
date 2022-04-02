"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubparser = exports.spendReputation = void 0;
const base64url_1 = __importDefault(require("base64url"));
const contracts_1 = require("../../contracts");
const circuits_1 = require("../../circuits");
const defaults_1 = require("./defaults");
const verifyReputationProof_1 = require("./verifyReputationProof");
const prefix_1 = require("./prefix");
const utils_1 = require("./utils");
const ethers_1 = require("ethers");
const configureSubparser = (subparsers) => {
    const parser = subparsers.add_parser('spendReputation', { add_help: true });
    parser.add_argument('-e', '--eth-provider', {
        action: 'store',
        type: 'str',
        help: `A connection string to an Ethereum provider. Default: ${defaults_1.DEFAULT_ETH_PROVIDER}`,
    });
    parser.add_argument('-ep', '--epoch', {
        action: 'store',
        type: 'int',
        help: 'The latest epoch user transitioned to. Default: current epoch',
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
        required: true,
        action: 'store',
        type: 'str',
        help: "The attester's Ethereum private key",
    });
};
exports.configureSubparser = configureSubparser;
const spendReputation = async (args) => {
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
    await (0, verifyReputationProof_1.verifyReputationProof)(args);
    // Parse Inputs
    const decodedProof = base64url_1.default.decode(args.proof.slice(prefix_1.reputationProofPrefix.length));
    const decodedPublicSignals = base64url_1.default.decode(args.public_signals.slice(prefix_1.reputationPublicSignalsPrefix.length));
    const proof = JSON.parse(decodedProof);
    const publicSignals = JSON.parse(decodedPublicSignals);
    const reputationProof = new contracts_1.ReputationProof(publicSignals, (0, circuits_1.formatProofForSnarkjsVerification)(proof));
    console.log(`User spends ${reputationProof.proveReputationAmount} reputation points from attester ${reputationProof.attesterId}`);
    // Submit reputation
    let tx;
    try {
        tx = await unirepContract
            .connect(wallet)
            .spendReputation(reputationProof, {
            value: attestingFee,
        });
        await tx.wait();
    }
    catch (error) {
        console.log('Transaction Error', error);
        return;
    }
    const proofIndex = await unirepContract.getProofIndex(reputationProof.hash());
    console.log('Transaction hash:', tx === null || tx === void 0 ? void 0 : tx.hash);
    console.log('Proof index:', proofIndex.toNumber());
};
exports.spendReputation = spendReputation;
