/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import FakeClient from '../stubs/fake-client'
import FakeElement from '../stubs/fake-element'
import count from '../../src/assertions/count'
import immediately from '../../src/chains/immediately'

//Using real chai, because it would be too much effort to stub/mock everything
chai.use(sinonChai)

const doesNotHaveCountError = (count, actualCount, defaultWait = 0) => {
  return (
    'Element with selector <.some-selector> does not ' +
    `appear in the DOM ${count} times within ${defaultWait} ms, ` +
    `but it shows up ${actualCount} times instead.`
  )
}

const hasCountError = (count, defaultWait = 0) => {
  return (
    'Element with selector <.some-selector> still ' +
    `appears in the DOM ${count} times after ${defaultWait} ms`
  )
}

describe('count', () => {
  let elements
  let fakeClient

  beforeEach(() => {
    elements = [new FakeElement(), new FakeElement()]
    fakeClient = new FakeClient()

    fakeClient.$$.rejects('ArgumentError')
    fakeClient.$$.withArgs('.some-selector').resolves(elements)

    fakeClient.waitUntil.callsFake(async (condition, timeout, timeoutMsg) => {
      if (await condition()) return

      throw new Error(timeoutMsg)
    })

    chai.use((chai, utils) => count(fakeClient, chai, utils))
    chai.use((chai, utils) => immediately(fakeClient, chai, utils))
  })

  afterEach(() => fakeClient.__resetStubs__())

  describe('When not negated', () => {
    beforeEach(async () => {
      await expect('.some-selector').to.have.count(elements.length)
    })

    it('Should call `waitUntil`', () => {
      expect(fakeClient.waitUntil).to.have.been.calledWithMatch(
        callback => callback(),
        0
      )
    })

    describe('When the element still does not appear the expected times after the wait time', () => {
      it('Should throw an exception', async () => {
        await expect(
          expect('.some-selector').to.have.count(elements.length + 1)
        ).to.be.rejectedWith(
          doesNotHaveCountError(elements.length + 1, elements.length)
        )
      })
    })
  })

  describe('When negated', () => {
    beforeEach(async () => {
      await expect('.some-selector').to.not.have.count(elements.length + 1)
    })

    it('Should call `waitUntil`', () => {
      expect(fakeClient.waitUntil).to.have.been.calledWithMatch(
        callback => callback(),
        0,
        hasCountError(elements.length + 1)
      )
    })

    describe('When the element still appears the expected times after the wait time', () => {
      it('Should throw an exception', async () => {
        await expect(
          expect('.some-selector').to.not.have.count(elements.length)
        ).to.be.rejectedWith(hasCountError(elements.length))
      })
    })
  })

  describe('When the element count matches the expectation', () => {
    it('Should not throw an exception', async () => {
      await expect('.some-selector').to.have.count(elements.length)
    })

    describe('When given a default wait time', () => {
      beforeEach(async () => {
        chai.use((chai, utils) =>
          count(fakeClient, chai, utils, { defaultWait: 100 })
        )

        await expect('.some-selector').to.have.count(elements.length)
      })

      it('Should call `waitUntil` with the specified wait time', () => {
        expect(fakeClient.waitUntil).to.have.been.calledWithMatch(
          callback => callback(),
          100
        )
      })
    })

    describe('When the call is chained with `immediately`', () => {
      beforeEach(async () => {
        await expect('.some-selector')
          .to.have.immediately()
          .count(elements.length)
      })

      it('Should not wait for the element to match the expected count', () => {
        expect(fakeClient.waitUntil).to.not.have.been.called
      })
    })

    describe('When the assertion is negated', () => {
      it('Should throw an exception', async () => {
        await expect(
          expect('.some-selector').to.not.have.count(elements.length)
        ).to.be.rejected
      })
    })
  })

  describe('When the element count does not match the expectation', () => {
    it('Should throw an exception', async () => {
      await expect(expect('.some-selector').to.have.count(elements.length + 1))
        .to.be.rejected
    })

    describe('When the assertion is negated', () => {
      it('Should not throw an exception', async () => {
        await expect('.some-selector').to.not.have.count(elements.length + 1)
      })
    })
  })
})
