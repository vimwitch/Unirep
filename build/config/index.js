"use strict";
/**
 * Default config use in unirep package
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_START_BLOCK = exports.MAX_ATTESTERS = exports.MAX_USERS = exports.MAX_REPUTATION_BUDGET = exports.EPOCH_TREE_DEPTH = exports.USER_STATE_TREE_DEPTH = exports.GLOBAL_STATE_TREE_DEPTH = exports.EPOCH_LENGTH = exports.NUM_ATTESTATIONS_PER_PROOF = exports.NUM_EPOCH_KEY_NONCE_PER_EPOCH = exports.ATTESTTING_FEE = void 0;
const ethers_1 = require("ethers");
exports.ATTESTTING_FEE = ethers_1.ethers.utils.parseEther('0.1');
exports.NUM_EPOCH_KEY_NONCE_PER_EPOCH = 3;
exports.NUM_ATTESTATIONS_PER_PROOF = 5;
exports.EPOCH_LENGTH = 30; // 30 seconds
exports.GLOBAL_STATE_TREE_DEPTH = 4;
exports.USER_STATE_TREE_DEPTH = 4;
exports.EPOCH_TREE_DEPTH = 32;
exports.MAX_REPUTATION_BUDGET = 10;
exports.MAX_USERS = 2 ** exports.GLOBAL_STATE_TREE_DEPTH - 1;
exports.MAX_ATTESTERS = 2 ** exports.USER_STATE_TREE_DEPTH - 1;
exports.DEFAULT_START_BLOCK = 0;
