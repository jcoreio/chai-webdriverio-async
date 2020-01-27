/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import FakeClient from '../stubs/fake-client'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

const fakeClient = new FakeClient()

const elementExists = sinon.stub()

const there = proxyquire('../../src/assertions/there', {
  '../util/element-exists': {
    default: elementExists,
  },
}).default

//Using real chai, because it would be too much effort to stub/mock everything
chai.use((chai, utils) => there(fakeClient, chai, utils))
chai.use(sinonChai)

describe('there', () => {
  beforeEach(() => {
    fakeClient.__resetStubs__()
    elementExists.reset()
    // Reset doesn't reset throws :(
    elementExists.resolves()
  })

  context("When element doesn't exist", () => {
    it('Should throw an error', async () => {
      elementExists.rejects(new Error())
      await expect(expect('.some-selector').to.be.there()).to.be.rejectedWith(
        /Expected .+ to be there/
      )
      expect(elementExists).to.have.been.calledOnce
    })

    context('When negated', () => {
      it('Should not throw an error', async () => {
        await expect(expect('.some-selector').to.not.be.there()).to.not.be
          .rejected
        expect(elementExists).to.have.been.calledWith(
          fakeClient,
          '.some-selector',
          0,
          true
        )
      })
    })
  })

  context('When element exists', () => {
    beforeEach(() => elementExists.resolves(true))

    it('Should not throw an exception', async () => {
      await expect('.some-selector').to.be.there()
    })

    context('When negated', () => {
      it('Should throw an exception', async () => {
        elementExists.rejects(new Error())
        await expect(
          expect('.some-selector').to.not.be.there()
        ).to.be.rejectedWith(/Expected .+ not to be there/)
        expect(elementExists).to.have.been.calledWith(
          fakeClient,
          '.some-selector',
          0,
          true
        )
      })
    })
  })
})
