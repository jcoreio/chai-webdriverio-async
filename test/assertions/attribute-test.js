/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import FakeClient from '../stubs/fake-client'
import FakeElement from '../stubs/fake-element'
import { describe, beforeEach, it } from 'mocha'
import chaiWebdriverio from '../../src'

const fakeClient = new FakeClient()
const fakeElement1 = new FakeElement()
const fakeElement2 = new FakeElement()

describe('attribute', () => {
  beforeEach(() => {
    fakeClient.__resetStubs__()
    fakeElement1.__resetStubs__()
    fakeElement2.__resetStubs__()

    chai.use(chaiWebdriverio(fakeClient))
  })

  describe(`When element doesn't exist`, function() {
    beforeEach(() => {
      fakeClient.$$.withArgs('.some-selector').resolves([])
    })

    describe('When not negated', function() {
      it(`should reject`, async function() {
        await expect('.some-selector')
          .to.have.attribute('foo')
          .to.be.rejectedWith(
            'Expected element <.some-selector> to have attribute foo, but no matching elements were found'
          )
        await expect('.some-selector')
          .to.have.attribute('foo', 'bar')
          .to.be.rejectedWith(
            'Expected element <.some-selector> to have attribute foo with value "bar", but no matching elements were found'
          )
      })
    })
    describe('When negated', function() {
      it(`should reject`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.attribute('foo')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have attribute foo, but no matching elements were found'
        )
        await expect(
          expect('.some-selector')
            .to.not.have.attribute('foo', 'bar')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have attribute foo with value "bar", but no matching elements were found'
        )
      })
    })
  })

  describe('When element exists', () => {
    let elementAttribute = 'Never gonna give you up'

    beforeEach(() => {
      fakeElement1.getAttribute.withArgs('foo').resolves(elementAttribute)
      fakeElement1.getAttribute.withArgs('bar').resolves(undefined)
      fakeClient.$$.withArgs('.some-selector').resolves([fakeElement1])
    })

    describe(`When not negated`, function() {
      it(`should resolve when attribute is present`, async function() {
        await expect('.some-selector').to.have.attribute('foo')
      })
      it(`should resolve when attribute equals expectation`, async function() {
        await expect('.some-selector').to.have.attribute(
          'foo',
          elementAttribute
        )
      })
      it(`should resolve when attribute matches expectation`, async function() {
        await expect('.some-selector').to.have.attribute('foo', /give you up/)
      })
      it(`should reject when attribute is missing`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.attribute('bar')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have attribute bar, but only found: '
        )
        await expect(
          expect('.some-selector')
            .to.have.attribute('bar', 'baz')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have attribute bar with value "baz", but only found: '
        )
      })
      it(`should reject when attribute doesn't equal expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.attribute('foo', 'blah')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have attribute foo with value "blah", but only found: "Never gonna give you up"'
        )
      })
      it(`should reject when attribute doesn't match expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.attribute('foo', /^gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have attribute foo with value /^gonna/, but only found: "Never gonna give you up"'
        )
      })
    })

    describe(`When negated`, function() {
      it(`should resolve when attribute is missing`, async function() {
        await expect('.some-selector').to.not.have.attribute('bar')
        await expect('.some-selector').to.not.have.attribute('bar', 'blargh')
      })
      it(`should resolve when attribute doesn't equal expectation`, async function() {
        await expect('.some-selector').to.not.have.attribute('foo', 'blargh')
      })
      it(`should resolve when attribute doesn't match expectation`, async function() {
        await expect('.some-selector').to.not.have.attribute('foo', /foog/)
      })
      it(`should reject when attribute is not missing`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.attribute('foo')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have attribute foo, but found: "Never gonna give you up"'
        )
      })
      it(`should reject when attribute equals expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.attribute('foo', elementAttribute)
            .then(null)
        ).to.be.rejectedWith(
          `Expected element <.some-selector> to not have attribute foo with value "Never gonna give you up", but found: "Never gonna give you up"`
        )
      })
      it(`should reject when attribute matches expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.attribute('foo', /gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have attribute foo with value /gonna/, but found: "Never gonna give you up"'
        )
      })
    })
  })
  describe(`When multiple elements exist`, function() {
    let elementAttribute1 = 'Never gonna give you up'
    let elementAttribute2 = 'Never gonna let you down'

    beforeEach(() => {
      fakeElement1.getAttribute.resolves(elementAttribute1)
      fakeElement2.getAttribute.resolves(elementAttribute2)
      fakeElement1.getAttribute.withArgs('foo').resolves(elementAttribute1)
      fakeElement1.getAttribute.withArgs('bar').resolves(undefined)
      fakeElement2.getAttribute.withArgs('foo').resolves(elementAttribute2)
      fakeElement2.getAttribute.withArgs('bar').resolves(undefined)
      fakeClient.$$.withArgs('.some-selector').resolves([
        fakeElement1,
        fakeElement2,
      ])
    })

    describe(`When not negated`, function() {
      it(`should resolve when attribute is present`, async function() {
        await expect('.some-selector').to.have.attribute('foo')
      })
      it(`should resolve when attribute equals expectation`, async function() {
        await expect('.some-selector').to.have.attribute(
          'foo',
          elementAttribute1
        )
        await expect('.some-selector').to.have.attribute(
          'foo',
          elementAttribute2
        )
      })
      it(`should resolve when attribute matches expectation`, async function() {
        await expect('.some-selector').to.have.attribute('foo', /Never gonna/)
        await expect('.some-selector').to.have.attribute('foo', /give you up/)
        await expect('.some-selector').to.have.attribute('foo', /let you down/)
      })
      it(`should reject when attribute is missing`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.attribute('bar')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have attribute bar, but only found: '
        )
        await expect(
          expect('.some-selector')
            .to.have.attribute('bar', 'blargh')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have attribute bar with value "blargh", but only found: '
        )
      })
      it(`should reject when attribute doesn't equal expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.attribute('foo', 'blah')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have attribute foo with value "blah", but only found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
      it(`should reject when attribute doesn't match expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.attribute('foo', /^gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have attribute foo with value /^gonna/, but only found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
    })
    describe(`When negated`, function() {
      it(`should resolve when attribute is missing`, async function() {
        await expect('.some-selector').to.not.have.attribute('bar')
        await expect('.some-selector').to.not.have.attribute('bar', 'blargh')
      })
      it(`should resolve when attribute doesn't equal expectation`, async function() {
        await expect('.some-selector').to.not.have.attribute('foo', 'blargh')
      })
      it(`should resolve when attribute doesn't match expectation`, async function() {
        await expect('.some-selector').to.not.have.attribute('foo', /foog/)
      })
      it(`should reject when attribute is not missing`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.attribute('foo')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have attribute foo, but found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
      it(`should reject when attribute equals expectation`, async function() {
        for (const attribute of [elementAttribute1, elementAttribute2]) {
          await expect(
            expect('.some-selector')
              .to.not.have.attribute('foo', attribute)
              .then(null)
          ).to.be.rejectedWith(
            `Expected element <.some-selector> to not have attribute foo with value ${JSON.stringify(
              attribute
            )}, but found: "Never gonna give you up", "Never gonna let you down"`
          )
        }
      })
      it(`should reject when attribute matches expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.attribute('foo', /gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have attribute foo with value /gonna/, but found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
    })
  })
})
