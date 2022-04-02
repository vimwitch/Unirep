"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubparser = exports.userStateTransition = void 0;
const base64url_1 = __importDefault(require("base64url"));
const ethers_1 = require("ethers");
const crypto_1 = require("../../crypto");
const circuits_1 = require("../../circuits");
const contracts_1 = require("../../contracts");
const defaults_1 = require("./defaults");
const src_1 = require("../src");
const prefix_1 = require("./prefix");
const utils_1 = require("./utils");
const configureSubparser = (subparsers) => {
    const parser = subparsers.add_parser('userStateTransition', {
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
const userStateTransition = async (args) => {
    // Ethereum provider
    const ethProvider = args.eth_provider
        ? args.eth_provider
        : defaults_1.DEFAULT_ETH_PROVIDER;
    const provider = (0, utils_1.getProvider)(ethProvider);
    // Unirep contract
    const unirepContract = contracts_1.UnirepFactory.connect(args.contract, provider);
    // Connect a signer
    const wallet = new ethers_1.ethers.Wallet(args.eth_privkey, provider);
    // Parse inputs
    const encodedIdentity = args.identity.slice(prefix_1.identityPrefix.length);
    const decodedIdentity = base64url_1.default.decode(encodedIdentity);
    const id = new crypto_1.ZkIdentity(crypto_1.Strategy.SERIALIZED, decodedIdentity);
    // Generate user state transition proofs
    const userState = await (0, src_1.genUserStateFromContract)(provider, args.contract, id);
    const { startTransitionProof, processAttestationProofs, finalTransitionProof, } = await userState.genUserStateTransitionProofs();
    // Start user state transition proof
    let isValid = await (0, circuits_1.verifyProof)(circuits_1.Circuit.startTransition, startTransitionProof.proof, startTransitionProof.publicSignals);
    if (!isValid) {
        console.error('Error: start state transition proof generated is not valid!');
    }
    let tx;
    try {
        tx = await unirepContract
            .connect(wallet)
            .startUserStateTransition(startTransitionProof.blindedUserState, startTransitionProof.blindedHashChain, startTransitionProof.globalStateTreeRoot, (0, circuits_1.formatProofForVerifierContract)(startTransitionProof.proof));
        await tx.wait();
    }
    catch (error) {
        console.log('Transaction Error', error);
        return;
    }
    console.log('Transaction hash:', tx.hash);
    // process attestations proof
    for (let i = 0; i < processAttestationProofs.length; i++) {
        const isValid = await (0, circuits_1.verifyProof)(circuits_1.Circuit.processAttestations, processAttestationProofs[i].proof, processAttestationProofs[i].publicSignals);
        if (!isValid) {
            console.error('Error: process attestations proof generated is not valid!');
        }
        try {
            tx = await unirepContract
                .connect(wallet)
                .processAttestations(processAttestationProofs[i].outputBlindedUserState, processAttestationProofs[i].outputBlindedHashChain, processAttestationProofs[i].inputBlindedUserState, (0, circuits_1.formatProofForVerifierContract)(processAttestationProofs[i].proof));
            await tx.wait();
        }
        catch (error) {
            console.log('Transaction Error', error);
            return;
        }
        console.log('Transaction hash:', tx.hash);
    }
    // Record all proof indexes
    const proofIndexes = [];
    {
        const proofHash = await unirepContract.hashStartTransitionProof(startTransitionProof.blindedUserState, startTransitionProof.blindedHashChain, startTransitionProof.globalStateTreeRoot, (0, circuits_1.formatProofForVerifierContract)(startTransitionProof.proof));
        const proofIndex = await unirepContract.getProofIndex(proofHash);
        proofIndexes.push(proofIndex);
    }
    for (let i = 0; i < processAttestationProofs.length; i++) {
        const proofHash = await unirepContract.hashProcessAttestationsProof(processAttestationProofs[i].outputBlindedUserState, processAttestationProofs[i].outputBlindedHashChain, processAttestationProofs[i].inputBlindedUserState, (0, circuits_1.formatProofForVerifierContract)(processAttestationProofs[i].proof));
        const proofIndex = await unirepContract.getProofIndex(proofHash);
        proofIndexes.push(proofIndex);
    }
    // update user state proof
    isValid = await (0, circuits_1.verifyProof)(circuits_1.Circuit.userStateTransition, finalTransitionProof.proof, finalTransitionProof.publicSignals);
    if (!isValid) {
        console.error('Error: user state transition proof generated is not valid!');
    }
    const fromEpoch = finalTransitionProof.transitionedFromEpoch;
    const epkNullifiers = userState.getEpochKeyNullifiers(fromEpoch);
    // Verify nullifiers outputted by circuit are the same as the ones computed off-chain
    for (let i = 0; i < epkNullifiers.length; i++) {
        const outputNullifier = finalTransitionProof.epochKeyNullifiers[i];
        if (outputNullifier != epkNullifiers[i]) {
            console.error(`Error: nullifier outputted by circuit(${outputNullifier}) does not match the ${i}-th computed attestation nullifier(${epkNullifiers[i]})`);
        }
    }
    // Check if Global state tree root and epoch tree root exist
    const GSTRoot = finalTransitionProof.fromGSTRoot;
    const inputEpoch = finalTransitionProof.transitionedFromEpoch;
    const epochTreeRoot = finalTransitionProof.fromEpochTree;
    const isGSTRootExisted = userState.GSTRootExists(GSTRoot, inputEpoch);
    const isEpochTreeExisted = await userState.epochTreeRootExists(epochTreeRoot, inputEpoch);
    if (!isGSTRootExisted) {
        console.error('Error: invalid global state tree root');
        return;
    }
    if (!isEpochTreeExisted) {
        console.error('Error: invalid epoch tree root');
        return;
    }
    // Check if nullifiers submitted before
    for (const nullifier of epkNullifiers) {
        if (userState.nullifierExist(nullifier)) {
            console.error('Error: nullifier submitted before');
            return;
        }
    }
    // Submit the user state transition transaction
    const USTProof = new contracts_1.UserTransitionProof(finalTransitionProof.publicSignals, finalTransitionProof.proof);
    try {
        tx = await unirepContract
            .connect(wallet)
            .updateUserStateRoot(USTProof, proofIndexes);
        await tx.wait();
    }
    catch (error) {
        console.log('Transaction Error', error);
        return;
    }
    console.log('Transaction hash:', tx === null || tx === void 0 ? void 0 : tx.hash);
    const currentEpoch = await unirepContract.currentEpoch();
    console.log(`User transitioned from epoch ${fromEpoch} to epoch ${currentEpoch}`);
};
exports.userStateTransition = userStateTransition;
