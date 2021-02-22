/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import { expect } from 'chai'
import FakeElement from '../stubs/fake-element'
import { describe, beforeEach, it } from 'mocha'
import fakeClient from '../stubs/fakeClient'

const fakeElement1 = new FakeElement()
const fakeElement2 = new FakeElement()

describe('value', () => {
  beforeEach(() => {
    fakeElement1.__resetStubs__()
    fakeElement2.__resetStubs__()
  })

  describe(`When element doesn't exist`, function() {
    beforeEach(() => {
      fakeClient.$$.withArgs('.some-selector').resolves([])
    })

    describe('When not negated', function() {
      it(`should reject`, async function() {
        await expect('.some-selector')
          .to.have.value('foo')
          .to.be.rejectedWith(
            'Expected element <.some-selector> to have value "foo", but no matching elements were found'
          )
      })
    })
    describe('When negated', function() {
      it(`should reject`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.value('foo')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have value "foo", but no matching elements were found'
        )
      })
    })
  })

  describe('When element exists', () => {
    let elementValue = 'Never gonna give you up'

    beforeEach(() => {
      fakeElement1.getValue.resolves(elementValue)
      fakeClient.$$.withArgs('.some-selector').resolves([fakeElement1])
    })

    describe(`When not negated`, function() {
      it(`should resolve when value equals expectation`, async function() {
        await expect('.some-selector').to.have.value(elementValue)
      })
      it(`should resolve when value matches expectation`, async function() {
        await expect('.some-selector').to.have.value(/give you up/)
      })
      it(`should reject when value doesn't equal expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.value('blah')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have value "blah", but only found: "Never gonna give you up"'
        )
      })
      it(`should reject when value doesn't match expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.value(/^gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have value /^gonna/, but only found: "Never gonna give you up"'
        )
      })
    })

    describe(`When negated`, function() {
      it(`should resolve when value doesn't equal expectation`, async function() {
        await expect('.some-selector').to.not.have.value('blargh')
      })
      it(`should resolve when value doesn't match expectation`, async function() {
        await expect('.some-selector').to.not.have.value(/foog/)
      })
      it(`should reject when value equals expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.value(elementValue)
            .then(null)
        ).to.be.rejectedWith(
          `Expected element <.some-selector> to not have value "Never gonna give you up", but found: "Never gonna give you up"`
        )
      })
      it(`should reject when value matches expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.value(/gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have value /gonna/, but found: "Never gonna give you up"'
        )
      })
    })
  })
  describe(`When multiple elements exist`, function() {
    let elementValue1 = 'Never gonna give you up'
    let elementValue2 = 'Never gonna let you down'

    beforeEach(() => {
      fakeElement1.getValue.resolves(elementValue1)
      fakeElement2.getValue.resolves(elementValue2)
      fakeClient.$$.withArgs('.some-selector').resolves([
        fakeElement1,
        fakeElement2,
      ])
    })

    describe(`When not negated`, function() {
      it(`should resolve when value equals expectation`, async function() {
        await expect('.some-selector').to.have.value(elementValue1)
        await expect('.some-selector').to.have.value(elementValue2)
      })
      it(`should resolve when value matches expectation`, async function() {
        await expect('.some-selector').to.have.value(/Never gonna/)
        await expect('.some-selector').to.have.value(/give you up/)
        await expect('.some-selector').to.have.value(/let you down/)
      })
      it(`should reject when value doesn't equal expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.value('blah')
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have value "blah", but only found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
      it(`should reject when value doesn't match expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.have.value(/^gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have value /^gonna/, but only found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
    })
    describe(`When negated`, function() {
      it(`should resolve when value doesn't equal expectation`, async function() {
        await expect('.some-selector').to.not.have.value('blargh')
      })
      it(`should resolve when value doesn't match expectation`, async function() {
        await expect('.some-selector').to.not.have.value(/foog/)
      })
      it(`should reject when value equals expectation`, async function() {
        for (const value of [elementValue1, elementValue2]) {
          await expect(
            expect('.some-selector')
              .to.not.have.value(value)
              .then(null)
          ).to.be.rejectedWith(
            `Expected element <.some-selector> to not have value ${JSON.stringify(
              value
            )}, but found: "Never gonna give you up", "Never gonna let you down"`
          )
        }
      })
      it(`should reject when value matches expectation`, async function() {
        await expect(
          expect('.some-selector')
            .to.not.have.value(/gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have value /gonna/, but found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
    })

    describe(`When not negated with .members`, function() {
      it(`resolves when all values are present`, async function() {
        await expect('.some-selector').value.to.have.members([
          elementValue2,
          elementValue1,
        ])
        await expect('.some-selector').value.to.have.members([
          elementValue1,
          elementValue2,
        ])
      })
      it(`rejects when excess actual values are present`, async function() {
        await expect(
          expect('.some-selector')
            .value.to.have.members([elementValue1])
            .then(null)
        ).to.be.rejectedWith(`elements' values for <.some-selector>`)
      })
      it(`rejects when some expected values are missing`, async function() {
        await expect(
          expect('.some-selector')
            .value.to.have.members([elementValue1, 'blah'])
            .then(null)
        ).to.be.rejectedWith(`elements' values for <.some-selector>`)
      })
    })

    describe(`With .members`, function() {
      it(`resolves when all values are present`, async function() {
        await expect('.some-selector').value.to.have.members([
          elementValue2,
          elementValue1,
        ])
        await expect('.some-selector').value.to.have.members([
          elementValue1,
          elementValue2,
        ])
      })
      it(`rejects when excess actual values are present`, async function() {
        await expect(
          expect('.some-selector')
            .value.to.have.members([elementValue1])
            .then(null)
        ).to.be.rejectedWith(
          `elements' values for <.some-selector>: expected [ Array(2) ] to have the same members as`
        )
      })
      it(`rejects when some expected values are missing`, async function() {
        await expect(
          expect('.some-selector')
            .value.to.have.members([elementValue1, 'blah'])
            .then(null)
        ).to.be.rejectedWith(`elements' values for <.some-selector>`)
      })
    })

    describe(`With .include/.contain/.includes`, function() {
      it(`resolves when all values are present`, async function() {
        await expect('.some-selector').value.to.include.members([
          elementValue1,
          elementValue2,
        ])
        await expect('.some-selector').value.to.include.members([
          elementValue2,
          elementValue1,
        ])
        await expect('.some-selector').value.to.include.members([elementValue1])
        await expect('.some-selector').value.to.include.members([elementValue2])
        await expect('.some-selector').value.to.contain(elementValue1)
        await expect('.some-selector').value.to.include(elementValue2)
        await expect('.some-selector').value.includes(elementValue2)
        await expect('.some-selector').value.to.contain.oneOf([
          'blah',
          elementValue2,
        ])
      })
      it(`rejects when some expected values are missing`, async function() {
        await expect(
          expect('.some-selector')
            .value.to.include.members([elementValue1, 'blah'])
            .then(null)
        ).to.be.rejectedWith(
          `elements' values for <.some-selector>: expected [ Array(2) ] to be a superset of`
        )
      })
    })

    describe(`With .satisfy`, function() {
      it(`resolves when satisfies expression`, async function() {
        await expect('.some-selector').value.to.satisfy(arr => arr.length === 2)
        await expect('.some-selector').value.to.satisfy(
          arr => arr[0] === elementValue1
        )
      })

      it(`rejects when doesn't satisfy expression`, async function() {
        await expect(
          expect('.some-selector')
            .value.to.satisfy(arr => arr[0] === elementValue2)
            .then(null)
        ).to.be.rejectedWith(
          `elements' values for <.some-selector>: expected [ Array(2) ] to satisfy [Function]`
        )
      })
    })
  })
})
