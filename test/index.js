import chai from 'chai'
import fakeClient from './stubs/fakeClient'
import { beforeEach } from 'mocha'
import chaiWebdriverio from '../src'

chai.use(chaiWebdriverio(fakeClient))

beforeEach(() => {
  fakeClient.__resetStubs__()
})
