"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubparser = exports.setAirdropAmount = void 0;
const ethers_1 = require("ethers");
const contracts_1 = require("../../contracts");
const defaults_1 = require("./defaults");
const utils_1 = require("./utils");
const configureSubparser = (subparsers) => {
    const parser = subparsers.add_parser('setAirdropAmount', { add_help: true });
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
    parser.add_argument('-a', '--airdrop', {
        required: true,
        type: 'int',
        help: 'The amount of airdrop positive reputation given by the attester',
    });
    parser.add_argument('-d', '--eth-privkey', {
        action: 'store',
        type: 'str',
        help: "The attester's Ethereum private key",
    });
};
exports.configureSubparser = configureSubparser;
const setAirdropAmount = async (args) => {
    // Ethereum provider
    const ethProvider = args.eth_provider
        ? args.eth_provider
        : defaults_1.DEFAULT_ETH_PROVIDER;
    const provider = (0, utils_1.getProvider)(ethProvider);
    // Unirep contract
    const unirepContract = contracts_1.UnirepFactory.connect(args.contract, provider);
    // Connect a signer
    const wallet = new ethers_1.ethers.Wallet(args.eth_privkey, provider);
    // Parse input
    const airdropPosRep = args.airdrop;
    const attesterId = await unirepContract.attesters(wallet.address);
    console.log(`Attester ${attesterId} sets its airdrop amount to ${airdropPosRep}`);
    // Submit attestation
    let tx;
    try {
        tx = await unirepContract
            .connect(wallet)
            .setAirdropAmount(airdropPosRep);
        await tx.wait();
    }
    catch (error) {
        console.log('Transaction Error', error);
        return;
    }
    console.log('Transaction hash:', tx.hash);
};
exports.setAirdropAmount = setAirdropAmount;
