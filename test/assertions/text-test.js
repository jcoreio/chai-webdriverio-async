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

describe('text', () => {
  beforeEach(() => {
    fakeElement1.__resetStubs__()
    fakeElement2.__resetStubs__()
  })

  describe(`When element doesn't exist`, function () {
    beforeEach(() => {
      fakeClient.$$.withArgs('.some-selector').resolves([])
    })

    describe('When not negated', function () {
      it(`should reject`, async function () {
        await expect('.some-selector')
          .to.have.text('foo')
          .to.be.rejectedWith(
            'Expected element <.some-selector> to have text "foo", but no matching elements were found'
          )
      })
    })
    describe('When negated', function () {
      it(`should reject`, async function () {
        await expect(
          expect('.some-selector').to.not.have.text('foo').then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have text "foo", but no matching elements were found'
        )
      })
    })
  })

  describe('When element exists', () => {
    let elementText = 'Never gonna give you up'

    beforeEach(() => {
      fakeElement1.getText.resolves(elementText)
      fakeClient.$$.withArgs('.some-selector').resolves([fakeElement1])
    })

    describe(`When not negated`, function () {
      it(`should resolve when text equals expectation`, async function () {
        await expect('.some-selector').to.have.text(elementText)
      })
      it(`should resolve when text matches expectation`, async function () {
        await expect('.some-selector').to.have.text(/give you up/)
      })
      it(`should reject when text doesn't equal expectation`, async function () {
        await expect(
          expect('.some-selector').to.have.text('blah').then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have text "blah", but only found: "Never gonna give you up"'
        )
      })
      it(`should reject when text doesn't match expectation`, async function () {
        await expect(
          expect('.some-selector')
            .to.have.text(/^gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have text /^gonna/, but only found: "Never gonna give you up"'
        )
      })
    })

    describe(`When negated`, function () {
      it(`should resolve when text doesn't equal expectation`, async function () {
        await expect('.some-selector').to.not.have.text('blargh')
      })
      it(`should resolve when text doesn't match expectation`, async function () {
        await expect('.some-selector').to.not.have.text(/foog/)
      })
      it(`should reject when text equals expectation`, async function () {
        await expect(
          expect('.some-selector').to.not.have.text(elementText).then(null)
        ).to.be.rejectedWith(
          `Expected element <.some-selector> to not have text "Never gonna give you up", but found: "Never gonna give you up"`
        )
      })
      it(`should reject when text matches expectation`, async function () {
        await expect(
          expect('.some-selector').to.not.have.text(/gonna/).then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have text /gonna/, but found: "Never gonna give you up"'
        )
      })
    })
  })
  describe(`When multiple elements exist`, function () {
    let elementText1 = 'Never gonna give you up'
    let elementText2 = 'Never gonna let you down'

    beforeEach(() => {
      fakeElement1.getText.resolves(elementText1)
      fakeElement2.getText.resolves(elementText2)
      fakeClient.$$.withArgs('.some-selector').resolves([
        fakeElement1,
        fakeElement2,
      ])
    })

    describe(`When not negated`, function () {
      it(`should resolve when text equals expectation`, async function () {
        await expect('.some-selector').to.have.text(elementText1)
        await expect('.some-selector').to.have.text(elementText2)
      })
      it(`should resolve when text matches expectation`, async function () {
        await expect('.some-selector').to.have.text(/Never gonna/)
        await expect('.some-selector').to.have.text(/give you up/)
        await expect('.some-selector').to.have.text(/let you down/)
      })
      it(`should reject when text doesn't equal expectation`, async function () {
        await expect(
          expect('.some-selector').to.have.text('blah').then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have text "blah", but only found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
      it(`should reject when text doesn't match expectation`, async function () {
        await expect(
          expect('.some-selector')
            .to.have.text(/^gonna/)
            .then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to have text /^gonna/, but only found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
    })
    describe(`When negated`, function () {
      it(`should resolve when text doesn't equal expectation`, async function () {
        await expect('.some-selector').to.not.have.text('blargh')
      })
      it(`should resolve when text doesn't match expectation`, async function () {
        await expect('.some-selector').to.not.have.text(/foog/)
      })
      it(`should reject when text equals expectation`, async function () {
        for (const text of [elementText1, elementText2]) {
          await expect(
            expect('.some-selector').to.not.have.text(text).then(null)
          ).to.be.rejectedWith(
            `Expected element <.some-selector> to not have text ${JSON.stringify(
              text
            )}, but found: "Never gonna give you up", "Never gonna let you down"`
          )
        }
      })
      it(`should reject when text matches expectation`, async function () {
        await expect(
          expect('.some-selector').to.not.have.text(/gonna/).then(null)
        ).to.be.rejectedWith(
          'Expected element <.some-selector> to not have text /gonna/, but found: "Never gonna give you up", "Never gonna let you down"'
        )
      })
    })

    describe(`With .members`, function () {
      it(`resolves when all texts are present`, async function () {
        await expect('.some-selector').text.to.have.members([
          elementText2,
          elementText1,
        ])
        await expect('.some-selector').text.to.have.members([
          elementText1,
          elementText2,
        ])
      })
      it(`rejects when excess actual texts are present`, async function () {
        await expect(
          expect('.some-selector')
            .text.to.have.members([elementText1])
            .then(null)
        ).to.be.rejectedWith(`elements' text for <.some-selector>`)
      })
      it(`rejects when some expected texts are missing`, async function () {
        await expect(
          expect('.some-selector')
            .text.to.have.members([elementText1, 'blah'])
            .then(null)
        ).to.be.rejectedWith(`elements' text for <.some-selector>`)
      })
    })

    describe(`With .include/.contain/.includes`, function () {
      it(`resolves when all texts are present`, async function () {
        await expect('.some-selector').text.to.include.members([
          elementText1,
          elementText2,
        ])
        await expect('.some-selector').text.to.include.members([
          elementText2,
          elementText1,
        ])
        await expect('.some-selector').text.to.include.members([elementText1])
        await expect('.some-selector').text.to.include.members([elementText2])
        await expect('.some-selector').text.to.contain(elementText1)
        await expect('.some-selector').text.to.include(elementText2)
        await expect('.some-selector').text.includes(elementText2)
        await expect('.some-selector').text.to.contain.oneOf([
          'blah',
          elementText2,
        ])
      })
      it(`rejects when some expected texts are missing`, async function () {
        await expect(
          expect('.some-selector')
            .text.to.include.members([elementText1, 'blah'])
            .then(null)
        ).to.be.rejectedWith(`elements' text for <.some-selector>`)
      })
    })

    describe(`With .satisfy`, function () {
      it(`resolves when satisfies expression`, async function () {
        await expect('.some-selector').text.to.satisfy(
          (arr) => arr.length === 2
        )
        await expect('.some-selector').text.to.satisfy(
          (arr) => arr[0] === elementText1
        )
      })

      it(`rejects when doesn't satisfy expression`, async function () {
        await expect(
          expect('.some-selector')
            .text.to.satisfy((arr) => arr[0] === elementText2)
            .then(null)
        ).to.be.rejectedWith(`elements' text for <.some-selector>`)
      })
    })
  })
})
