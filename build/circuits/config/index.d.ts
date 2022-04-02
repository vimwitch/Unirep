declare enum Circuit {
    verifyEpochKey = "verifyEpochKey",
    proveReputation = "proveReputation",
    proveUserSignUp = "proveUserSignUp",
    startTransition = "startTransition",
    processAttestations = "processAttestations",
    userStateTransition = "userStateTransition"
}
declare const verifyEpochKeyCircuitPath = "../zksnarkBuild/verifyEpochKey_main.circom";
declare const proveReputationCircuitPath = "../zksnarkBuild/proveReputation_main.circom";
declare const proveUserSignUpCircuitPath = "../zksnarkBuild/proveUserSignUp_main.circom";
declare const startTransitionCircuitPath = "../zksnarkBuild/startTransition_main.circom";
declare const processAttestationsCircuitPath = "../zksnarkBuild/processAttestations_main.circom";
declare const userStateTransitionCircuitPath = "../zksnarkBuild/userStateTransition_main.circom";
export { Circuit, verifyEpochKeyCircuitPath, proveReputationCircuitPath, proveUserSignUpCircuitPath, startTransitionCircuitPath, processAttestationsCircuitPath, userStateTransitionCircuitPath, };
