/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import FakeClient from '../stubs/fake-client'
import chaiWebdriverio from '../../src/index'
import FakeElement from '../stubs/fake-element'

describe('displayed', () => {
  let fakeClient
  let fakeElement1

  beforeEach(() => {
    fakeClient = new FakeClient()
    fakeElement1 = new FakeElement()

    fakeElement1.isDisplayed.resolves(false)
    fakeClient.$$.withArgs('.some-selector').resolves([fakeElement1])
    fakeClient.$$.withArgs('.other-selector').resolves([])

    chai.use(chaiWebdriverio(fakeClient))
  })

  afterEach(() => {
    fakeClient.__resetStubs__()
    fakeElement1.__resetStubs__()
  })

  describe('When not negated', () => {
    it(`resolves when element is displayed`, async function() {
      fakeElement1.isDisplayed.resolves(true)
      await expect('.some-selector').to.be.displayed()
    })
    it(`rejects when element is not displayed`, async function() {
      await expect('.some-selector')
        .to.be.displayed()
        .to.be.rejectedWith(
          'Expected <.some-selector> to be displayed but it is not'
        )
    })
    it(`rejects when element does not exist`, async function() {
      await expect('.other-selector')
        .to.be.displayed()
        .to.be.rejectedWith(
          'Expected <.other-selector> to be displayed but it is not'
        )
    })
  })
  describe('When negated', () => {
    it(`rejects when element is displayed`, async function() {
      fakeElement1.isDisplayed.resolves(true)
      await expect(
        expect('.some-selector')
          .not.to.be.displayed()
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> to not be displayed but it is'
      )
    })
    it(`resolves when element is not displayed`, async function() {
      await expect('.some-selector').not.to.be.displayed()
    })
    it(`resolves when element does not exist`, async function() {
      await expect('.other-selector').not.to.be.displayed()
    })
  })
})
