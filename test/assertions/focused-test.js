/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import FakeClient from '../stubs/fake-client'
import chaiWebdriverio from '../../src/index'
import FakeElement from '../stubs/fake-element'

describe('focused', () => {
  let fakeClient
  let fakeElement1

  beforeEach(() => {
    fakeClient = new FakeClient()
    fakeElement1 = new FakeElement()

    fakeElement1.isFocused.resolves(false)
    fakeClient.$$.withArgs('.some-selector').resolves([fakeElement1])
    fakeClient.$$.withArgs('.other-selector').resolves([])

    chai.use(chaiWebdriverio(fakeClient))
  })

  afterEach(() => {
    fakeClient.__resetStubs__()
    fakeElement1.__resetStubs__()
  })

  describe('When not negated', () => {
    it(`resolves when element is focused`, async function() {
      fakeElement1.isFocused.resolves(true)
      await expect('.some-selector').to.be.focused()
    })
    it(`rejects when element is not focused`, async function() {
      await expect('.some-selector')
        .to.be.focused()
        .to.be.rejectedWith(
          'Expected <.some-selector> to be focused but it is not'
        )
    })
    it(`rejects when element does not exist`, async function() {
      await expect('.other-selector')
        .to.be.focused()
        .to.be.rejectedWith(
          'Expected <.other-selector> to be focused but no matching elements were found'
        )
    })
  })
  describe('When negated', () => {
    it(`rejects when element is focused`, async function() {
      fakeElement1.isFocused.resolves(true)
      await expect(
        expect('.some-selector')
          .not.to.be.focused()
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> to not be focused but it is'
      )
    })
    it(`resolves when element is not focused`, async function() {
      await expect('.some-selector').not.to.be.focused()
    })
    it(`rejects when element does not exist`, async function() {
      await expect(
        expect('.other-selector')
          .not.to.be.focused()
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.other-selector> to not be focused but no matching elements were found'
      )
    })
  })
})
