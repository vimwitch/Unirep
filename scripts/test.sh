# circuit unit tests
mocha -r ts-node/register ./circuits/test/*.test.ts --exit

# contract unit tests
NODE_OPTIONS=--max-old-space-size=4096 npx hardhat test --no-compile $(find ./contracts/test -name '*.test.ts')

# unirep core tests
NODE_OPTIONS=--max-old-space-size=4096 npx hardhat test --no-compile $(find ./core/test/integration -name '*.test.ts')
NODE_OPTIONS=--max-old-space-size=4096 npx hardhat test --no-compile $(find ./core/test/UnirepState -name '*.test.ts')
NODE_OPTIONS=--max-old-space-size=4096 npx hardhat test --no-compile $(find ./core/test/UserState -name '*.test.ts')


# cli tests
./scripts/testCLI.sh