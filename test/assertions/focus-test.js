/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import FakeClient from '../stubs/fake-client'
import FakeElement from '../stubs/fake-element'
import immediately from '../../src/chains/immediately'
import focus from '../../src/assertions/focus'

const fakeClient = new FakeClient()
const fakeElement = new FakeElement()

//Using real chai, because it would be too much effort to stub/mock everything
chai.use((chai, utils) => focus(fakeClient, chai, utils))
chai.use((chai, utils) => immediately(fakeClient, chai, utils))
chai.use(sinonChai)

describe('focus', () => {
  beforeEach(() => {
    fakeClient.__resetStubs__()
    fakeElement.__resetStubs__()
  })

  describe("When element doesn't exist", () => {
    it('Should throw an error', async () => {
      await expect(expect('.some-selector').to.have.focus()).to.be.rejected
    })

    context('When negated', () => {
      it('Should throw an error', async () => {
        await expect(expect('.some-selector').to.not.have.focus()).to.be
          .rejected
      })
    })
  })

  describe('When element exists', () => {
    describe('When element is focused', () => {
      beforeEach(() => {
        fakeClient.$$.resolves([fakeElement])
        fakeElement.isFocused.resolves(true)
      })

      it('Should not throw an exception', async () => {
        await expect('.some-selector').to.have.focus()
      })

      describe('When negated', () => {
        it('Should throw an exception', async () => {
          await expect(expect('.some-selector').to.not.have.focus()).to.be
            .rejected
        })
      })
    })
  })
})
