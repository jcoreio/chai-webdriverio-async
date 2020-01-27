/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import FakeClient from '../stubs/fake-client'
import FakeElement from '../stubs/fake-element'
import elementExists from '../../src/util/element-exists'

const fakeClient = new FakeClient()
const fakeElement = new FakeElement()

chai.use(sinonChai)

describe('elementExists', () => {
  beforeEach(() => {
    fakeClient.__resetStubs__()
    fakeElement.__resetStubs__()

    fakeClient.$.resolves(fakeElement)
  })

  describe('When in synchronous mode', () => {
    it("Should throw element doesn't exist error", async () => {
      fakeElement.waitForExist.rejects()
      await expect(elementExists(fakeClient, 'bla', 0)).to.be.rejectedWith(
        /Could not find element with selector/
      )
    })
    describe('When the element exist', () => {
      it('Should NOT throw an error', async () => {
        fakeElement.waitForExist.resolves()
        await expect(elementExists(fakeClient, 'bla', 0)).to.not.be.rejected
      })
    })
  })
})
