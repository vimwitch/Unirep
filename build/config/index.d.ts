/**
 * Default config use in unirep package
 */
import { ethers } from 'ethers';
export declare const ATTESTTING_FEE: ethers.BigNumber;
export declare const NUM_EPOCH_KEY_NONCE_PER_EPOCH = 3;
export declare const NUM_ATTESTATIONS_PER_PROOF = 5;
export declare const EPOCH_LENGTH = 30;
export declare const GLOBAL_STATE_TREE_DEPTH = 4;
export declare const USER_STATE_TREE_DEPTH = 4;
export declare const EPOCH_TREE_DEPTH = 32;
export declare const MAX_REPUTATION_BUDGET = 10;
export declare const MAX_USERS: number;
export declare const MAX_ATTESTERS: number;
