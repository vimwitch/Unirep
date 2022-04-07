import {Command, Flags} from '@oclif/core'
import UnirepBase from '../base'

export default class Deploy extends UnirepBase {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    ...UnirepBase.flags, 
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Deploy);
    console.log(await this.web3Provider?.getNetwork());
  }
}
