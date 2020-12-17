/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import FakeClient from '../stubs/fake-client'
import FakeElement from '../stubs/fake-element'
import chaiWebdriverio from '../../src/index'

describe('count', () => {
  let elements
  let fakeClient

  beforeEach(() => {
    elements = [new FakeElement(), new FakeElement()]
    fakeClient = new FakeClient()

    fakeClient.$$.rejects('ArgumentError')
    fakeClient.$$.withArgs('.some-selector').resolves(elements)

    chai.use(chaiWebdriverio(fakeClient))
  })

  afterEach(() => fakeClient.__resetStubs__())

  describe('When not negated', () => {
    it(`resolves when element count matches expectation`, async function() {
      await expect('.some-selector').to.have.count(2)
    })
    it(`rejects when element count does not match expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.have.count(1)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> to appear in the DOM 1 times, but it shows up 2 times instead.'
      )
    })
  })

  describe('When negated', () => {
    it(`resolves when element count does not match expectation`, async function() {
      await expect('.some-selector').not.to.have.count(3)
    })
    it(`rejects when element count matches expectation`, async function() {
      await expect(
        expect('.some-selector')
          .not.to.have.count(2)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> not to appear in the DOM 2 times, but it does.'
      )
    })
  })
})
