//  TODO: better setup for cli Ethereum client.
// import { ALCHEMY_API_KEY } from '../config/privateKey'

import {
    ATTESTTING_FEE,
    EPOCH_LENGTH,
    NUM_EPOCH_KEY_NONCE_PER_EPOCH,
} from '@unirep/config'

// apply the api key from https://www.alchemy.com/
// const DEFAULT_ETH_PROVIDER = `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
// const DEFAULT_ETH_PROVIDER = `https://goerli.infura.io/v3/${INFURA_API_KEY}`
const DEFAULT_ETH_PROVIDER = 'http://localhost:8545'
const DEFAULT_START_BLOCK = 0
const DEFAULT_MAX_EPOCH_KEY_NONCE = NUM_EPOCH_KEY_NONCE_PER_EPOCH
const DEFAULT_EPOCH_LENGTH = EPOCH_LENGTH
const DEFAULT_ATTESTING_FEE = ATTESTTING_FEE

export {
    DEFAULT_ETH_PROVIDER,
    DEFAULT_START_BLOCK,
    DEFAULT_MAX_EPOCH_KEY_NONCE,
    DEFAULT_EPOCH_LENGTH,
    DEFAULT_ATTESTING_FEE,
}
