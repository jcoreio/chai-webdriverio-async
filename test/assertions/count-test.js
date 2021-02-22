/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import { expect } from 'chai'
import FakeElement from '../stubs/fake-element'
import { describe, beforeEach, it } from 'mocha'
import fakeClient from '../stubs/fakeClient'

describe('count', () => {
  let elements

  beforeEach(() => {
    elements = [new FakeElement(), new FakeElement()]

    fakeClient.$$.rejects('ArgumentError')
    fakeClient.$$.withArgs('.some-selector').resolves(elements)
  })

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
  describe(`when not negated with above`, function() {
    it(`resolves when element count is above expectation`, async function() {
      await expect('.some-selector').to.have.count.above(1)
      await expect('.some-selector').to.have.count.above(0)
    })
    it(`rejects when element count is not above expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.have.count.above(2)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> to appear in the DOM more than 2 times, but it shows up 2 times instead.'
      )
    })
  })
  describe(`when negated with above`, function() {
    it(`resolves when element count is not above expectation`, async function() {
      await expect('.some-selector').to.not.have.count.above(2)
      await expect('.some-selector').to.not.have.count.above(3)
    })
    it(`rejects when element count is above expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.not.have.count.above(1)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> not to appear in the DOM more than 1 times, but it shows up 2 times instead.'
      )
    })
  })
  describe(`when not negated with at.least`, function() {
    it(`resolves when element count is at least expectation`, async function() {
      await expect('.some-selector').to.have.count.at.least(2)
      await expect('.some-selector').to.have.count.at.least(1)
    })
    it(`rejects when element count is not at least expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.have.count.at.least(3)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> to appear in the DOM at least 3 times, but it shows up 2 times instead.'
      )
    })
  })
  describe(`when negated with at.least`, function() {
    it(`resolves when element count is not at least expectation`, async function() {
      await expect('.some-selector').to.not.have.count.at.least(3)
      await expect('.some-selector').to.not.have.count.at.least(4)
    })
    it(`rejects when element count is at least expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.not.have.count.at.least(2)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> not to appear in the DOM at least 2 times, but it shows up 2 times instead.'
      )
    })
  })
  describe(`when not negated with below`, function() {
    it(`resolves when element count is below expectation`, async function() {
      await expect('.some-selector').to.have.count.below(3)
      await expect('.some-selector').to.have.count.below(4)
    })
    it(`rejects when element count is not below expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.have.count.below(2)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> to appear in the DOM less than 2 times, but it shows up 2 times instead.'
      )
    })
  })
  describe(`when negated with below`, function() {
    it(`resolves when element count is not below expectation`, async function() {
      await expect('.some-selector').to.not.have.count.below(2)
      await expect('.some-selector').to.not.have.count.below(1)
    })
    it(`rejects when element count is not below expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.not.have.count.below(3)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> not to appear in the DOM less than 3 times, but it shows up 2 times instead.'
      )
    })
  })
  describe(`when not negated with at.most`, function() {
    it(`resolves when element count is at most expectation`, async function() {
      await expect('.some-selector').to.have.count.at.most(2)
      await expect('.some-selector').to.have.count.at.most(3)
    })
    it(`rejects when element count is not at most expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.have.count.at.most(1)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> to appear in the DOM at most 1 times, but it shows up 2 times instead.'
      )
    })
  })
  describe(`when negated with at.most`, function() {
    it(`resolves when element count is not at most expectation`, async function() {
      await expect('.some-selector').to.not.have.count.at.most(1)
      await expect('.some-selector').to.not.have.count.at.most(0)
    })
    it(`rejects when element count is at most expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.not.have.count.at.most(2)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> not to appear in the DOM at most 2 times, but it shows up 2 times instead.'
      )
    })
  })

  describe(`when not negated with within`, function() {
    it(`resolves when element count is within expectation`, async function() {
      await expect('.some-selector').to.have.count.within(2, 4)
      await expect('.some-selector').to.have.count.within(1, 2)
      await expect('.some-selector').to.have.count.within(1, 4)
    })
    it(`rejects when element count is not within expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.have.count.within(0, 1)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> to appear in the DOM between 0 and 1 times, but it shows up 2 times instead.'
      )
    })
  })
  describe(`when negated with within`, function() {
    it(`resolves when element count is not within expectation`, async function() {
      await expect('.some-selector').to.not.have.count.within(0, 1)
      await expect('.some-selector').to.not.have.count.within(3, 4)
    })
    it(`rejects when element count is within expectation`, async function() {
      await expect(
        expect('.some-selector')
          .to.not.have.count.within(1, 2)
          .then(null)
      ).to.be.rejectedWith(
        'Expected <.some-selector> not to appear in the DOM between 1 and 2 times, but it shows up 2 times instead.'
      )
    })
  })
})
