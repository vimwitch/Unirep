import { Web3Provider } from '@ethersproject/providers';
import {Command, Flags} from '@oclif/core'
import { ethers } from 'ethers';
import { DEFAULT_ETH_PROVIDER } from './default';
import { getProvider } from './utils';

export default abstract class UnirepBase extends Command {
  public web3Provider?: ethers.providers.Provider;

  static flags = {
     provider: Flags.string({
        char: "p",
        description: "Ethereum provider", 
        env: "DEFAULT_ETH_PROVIDER",
        required: true,
        default: DEFAULT_ETH_PROVIDER,
     })
  }
  async init(): Promise<void> {
      const {flags} = await this.parse(UnirepBase);
      console.log(flags.provider);
      this.web3Provider = getProvider(flags.provider);
  }
}
