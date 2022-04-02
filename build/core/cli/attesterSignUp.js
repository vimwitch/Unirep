"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubparser = exports.attesterSignUp = void 0;
const ethers_1 = require("ethers");
const contracts_1 = require("../../contracts");
const defaults_1 = require("./defaults");
const utils_1 = require("./utils");
const configureSubparser = (subparsers) => {
    const parser = subparsers.add_parser('attesterSignUp', { add_help: true });
    parser.add_argument('-e', '--eth-provider', {
        action: 'store',
        type: 'str',
        help: `A connection string to an Ethereum provider. Default: ${defaults_1.DEFAULT_ETH_PROVIDER}`,
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
const attesterSignUp = async (args) => {
    // Ethereum provider
    const ethProvider = args.eth_provider
        ? args.eth_provider
        : defaults_1.DEFAULT_ETH_PROVIDER;
    const provider = (0, utils_1.getProvider)(ethProvider);
    // Unirep contract
    const unirepContract = contracts_1.UnirepFactory.connect(args.contract, provider);
    // Connect a signer
    const wallet = new ethers_1.ethers.Wallet(args.eth_privkey, provider);
    // Submit the user sign up transaction
    let tx;
    try {
        tx = await unirepContract.connect(wallet).attesterSignUp();
        await tx.wait();
    }
    catch (error) {
        console.log('Transaction Error', error);
        return;
    }
    const ethAddr = ethers_1.ethers.utils.computeAddress(args.eth_privkey);
    const attesterId = await unirepContract.attesters(ethAddr);
    if (attesterId.toNumber() == 0) {
        console.error('Error: sign up succeeded but has no attester id!');
    }
    console.log('Transaction hash:', tx.hash);
    console.log('Attester sign up with attester id:', attesterId.toNumber());
};
exports.attesterSignUp = attesterSignUp;
