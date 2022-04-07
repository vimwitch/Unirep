import {expect, test} from '@oclif/test'

describe('deploy', () => {
  test
  .stdout()
  .command(['deploy'])
  .it('runs deploy', ctx => {
    expect(ctx.stdout).to.contain('http://localhost:8545');
  })
})
