# build circuits
./scripts/downloadPtau.sh
npx ts-node ./scripts/buildCircuits.ts
./scripts/buildVerifyEpochKeySnark.sh
./scripts/buildUserStateTransitionSnark.sh
./scripts/buildProveReputationSnark.sh
./scripts/buildProveUserSignUpSnark.sh
cp ./zksnarkBuild/**.wasm ./build/zksnarkBuild/
cp ./zksnarkBuild/**.zkey ./build/zksnarkBuild/

# build contracts
./scripts/buildVerifiers.sh 
npx hardhat compile
npx hardhat typechain

# build all
tsc

# linter
prettier --write .