import { Circuit } from '../config/index';
declare const executeCircuit: (circuit: any, inputs: any) => Promise<any>;
declare const getVKey: (circuitName: Circuit) => Promise<any>;
declare const getSignalByName: (circuit: any, witness: any, signal: string) => Promise<any>;
declare const genProofAndPublicSignals: (circuitName: Circuit, inputs: any) => Promise<any>;
declare const verifyProof: (circuitName: Circuit, proof: SnarkProof, publicSignals: SnarkPublicSignals) => Promise<boolean>;
declare const formatProofForVerifierContract: (proof: SnarkProof) => string[];
declare const formatProofForSnarkjsVerification: (proof: string[]) => SnarkProof;
export { Circuit, executeCircuit, formatProofForVerifierContract, formatProofForSnarkjsVerification, getVKey, getSignalByName, genProofAndPublicSignals, verifyProof, };
