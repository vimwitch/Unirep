"use strict";
//  TODO: better setup for cli Ethereum client.
// import { ALCHEMY_API_KEY } from '../config/privateKey'
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ATTESTING_FEE = exports.DEFAULT_EPOCH_LENGTH = exports.DEFAULT_MAX_EPOCH_KEY_NONCE = exports.DEFAULT_START_BLOCK = exports.DEFAULT_ETH_PROVIDER = void 0;
const config_1 = require("../config");
// apply the api key from https://www.alchemy.com/
// const DEFAULT_ETH_PROVIDER = `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
// const DEFAULT_ETH_PROVIDER = `https://goerli.infura.io/v3/${INFURA_API_KEY}`
const DEFAULT_ETH_PROVIDER = 'http://localhost:8545';
exports.DEFAULT_ETH_PROVIDER = DEFAULT_ETH_PROVIDER;
const DEFAULT_START_BLOCK = 0;
exports.DEFAULT_START_BLOCK = DEFAULT_START_BLOCK;
const DEFAULT_MAX_EPOCH_KEY_NONCE = config_1.NUM_EPOCH_KEY_NONCE_PER_EPOCH;
exports.DEFAULT_MAX_EPOCH_KEY_NONCE = DEFAULT_MAX_EPOCH_KEY_NONCE;
const DEFAULT_EPOCH_LENGTH = config_1.EPOCH_LENGTH;
exports.DEFAULT_EPOCH_LENGTH = DEFAULT_EPOCH_LENGTH;
const DEFAULT_ATTESTING_FEE = config_1.ATTESTTING_FEE;
exports.DEFAULT_ATTESTING_FEE = DEFAULT_ATTESTING_FEE;
