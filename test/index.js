import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fakeClient from './stubs/fakeClient'
import { beforeEach, describe, it } from 'mocha'
import chaiWebdriverio from '../src'
chai.config.includeStack = true
chai.use(chaiAsPromised)
chai.use(chaiWebdriverio(fakeClient))

beforeEach(() => {
  fakeClient.__resetStubs__()
})

describe(`builtin chains still work`, function () {
  it(`.above`, async function () {
    expect(3).to.be.above(2)
  })
  it(`.include`, function () {
    expect([1, 2, 3]).to.include(2)
  })
  it(`.members`, function () {
    expect([1, 2, 3]).to.include.members([3, 1, 2])
  })
  it(`.oneOf`, function () {
    expect([1, 2, 3]).to.include.oneOf([4, 3])
  })
  it(`.satisfy`, function () {
    expect(5).to.satisfy((x) => x > 4)
  })
})
