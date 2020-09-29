#!/bin/bash

set -e

cd "$(dirname "$0")"
cd ..
mkdir -p build

NODE_OPTIONS=--max-old-space-size=8192 npx ts-node scripts/buildSnarks.ts -i circuits/test/verifyEpochKey_test.circom -j build/verifyEpochKeyCircuit.r1cs -w build/verifyEpochKey.wasm -p build/verifyEpochKeyPk.json -v build/verifyEpochKeyVk.json -s build/EpochKeyValidityVerifier.sol -vs EpochKeyValidityVerifier -z build/verifyEpochKey.zkey

echo 'Copying EpochKeyValidityVerifier.sol to contracts/'
cp ./build/EpochKeyValidityVerifier.sol ./contracts/