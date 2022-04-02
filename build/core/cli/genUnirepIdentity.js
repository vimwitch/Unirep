"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSubparser = exports.genUnirepIdentity = void 0;
const base64url_1 = __importDefault(require("base64url"));
const crypto_1 = require("../../crypto");
const prefix_1 = require("./prefix");
const configureSubparser = (subparsers) => {
    subparsers.add_parser('genUnirepIdentity', { add_help: true });
};
exports.configureSubparser = configureSubparser;
const genUnirepIdentity = async (args) => {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    const id = new crypto_1.ZkIdentity();
    const commitment = id.genIdentityCommitment();
    const serializedIdentity = id.serializeIdentity();
    const encodedIdentity = base64url_1.default.encode(serializedIdentity);
    console.log(prefix_1.identityPrefix + encodedIdentity);
    const serializedIdentityCommitment = commitment.toString();
    const encodedIdentityCommitment = base64url_1.default.encode(serializedIdentityCommitment);
    console.log(prefix_1.identityCommitmentPrefix + encodedIdentityCommitment);
};
exports.genUnirepIdentity = genUnirepIdentity;
