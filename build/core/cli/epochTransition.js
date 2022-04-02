"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubparser = exports.epochTransition = void 0;
const defaults_1 = require("./defaults");
const utils_1 = require("./utils");
const contracts_1 = require("../../contracts");
const ethers_1 = require("ethers");
const configureSubparser = (subparsers) => {
    const parser = subparsers.add_parser('epochTransition', { add_help: true });
    parser.add_argument('-e', '--eth-provider', {
        action: 'store',
        type: 'str',
        help: `A connection string to an Ethereum provider. Default: ${defaults_1.DEFAULT_ETH_PROVIDER}`,
    });
    parser.add_argument('-t', '--is-test', {
        action: 'store_true',
        help: 'Indicate if the provider is a testing environment',
    });
    parser.add_argument('-x', '--contract', {
        required: true,
        type: 'str',
        help: 'The Unirep contract address',
    });
    parser.add_argument('-d', '--eth-privkey', {
        action: 'store',
        type: 'str',
        help: "The deployer's Ethereum private key",
    });
};
exports.configureSubparser = configureSubparser;
const epochTransition = async (args) => {
    // Ethereum provider
    const ethProvider = args.eth_provider
        ? args.eth_provider
        : defaults_1.DEFAULT_ETH_PROVIDER;
    const provider = (0, utils_1.getProvider)(ethProvider);
    // Unirep contract
    const unirepContract = contracts_1.UnirepFactory.connect(args.contract, provider);
    // Connect a signer
    const wallet = new ethers_1.ethers.Wallet(args.eth_privkey, provider);
    // Fast-forward to end of epoch if in test environment
    if (args.is_test) {
        const epochLength = (await unirepContract.epochLength()).toNumber();
        await provider.send('evm_increaseTime', [epochLength]);
    }
    const currentEpoch = await unirepContract.currentEpoch();
    let tx;
    try {
        tx = await unirepContract.connect(wallet).beginEpochTransition();
        await tx.wait();
    }
    catch (error) {
        console.log('Transaction Error', error);
        return;
    }
    console.log('Transaction hash:', tx.hash);
    console.log('End of epoch:', currentEpoch.toString());
};
exports.epochTransition = epochTransition;
