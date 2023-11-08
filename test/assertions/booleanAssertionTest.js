import { expect } from 'chai'
import { describe, beforeEach, afterEach, it } from 'mocha'
import FakeElement from '../stubs/fake-element'
import { upperFirst, lowerCase } from 'lodash'
import fakeClient from '../stubs/fakeClient'

export const booleanAssertionTest = ({
  method,
  expectation = lowerCase(method),
  allowNone,
}) =>
  describe(method, () => {
    let fakeElement1

    beforeEach(() => {
      fakeElement1 = new FakeElement()

      fakeElement1[`is${upperFirst(method)}`].resolves(false)
      fakeClient.$$.withArgs('.some-selector').resolves([fakeElement1])
      fakeClient.$$.withArgs('.other-selector').resolves([])
    })

    afterEach(() => {
      fakeElement1.__resetStubs__()
    })

    describe('When not negated', () => {
      it(`resolves when element is ${expectation}`, async function () {
        fakeElement1[`is${upperFirst(method)}`].resolves(true)
        await expect('.some-selector').to.be[method]()
      })
      it(`resolves when element is ${expectation} -- via promise resolving to array`, async function () {
        fakeElement1[`is${upperFirst(method)}`].resolves(true)
        await expect(Promise.resolve([fakeElement1])).to.be[method]()
      })
      it(`resolves when element is ${expectation} -- via promise resolving to element`, async function () {
        fakeElement1[`is${upperFirst(method)}`].resolves(true)
        await expect(Promise.resolve(fakeElement1)).to.be[method]()
      })
      it(`resolves when element is ${expectation} -- via array`, async function () {
        fakeElement1[`is${upperFirst(method)}`].resolves(true)
        await expect([fakeElement1]).to.be[method]()
      })
      it(`resolves when element is ${expectation} -- via element`, async function () {
        fakeElement1[`is${upperFirst(method)}`].resolves(true)
        await expect(fakeElement1).to.be[method]()
      })
      it(`rejects when element is not ${expectation}`, async function () {
        await expect('.some-selector')
          .to.be[method]()
          .to.be.rejectedWith(
            `Expected element <.some-selector> to be ${expectation} but it is not`
          )
      })
      it(`rejects when element is not ${expectation} -- via promise`, async function () {
        await expect(
          Object.assign(Promise.resolve(fakeElement1), {
            selector: '.some-selector',
          })
        )
          .to.be[method]()
          .to.be.rejectedWith(
            `Expected element <.some-selector> to be ${expectation} but it is not`
          )
      })

      it(`rejects when element does not exist`, async function () {
        await expect('.other-selector')
          .to.be[method]()
          .to.be.rejectedWith(
            allowNone
              ? `Expected element <.other-selector> to be ${expectation} but it is not`
              : `Expected element <.other-selector> to be ${expectation} but no matching elements were found`
          )
      })
    })
    describe('When negated', () => {
      it(`rejects when element is ${expectation}`, async function () {
        fakeElement1[`is${upperFirst(method)}`].resolves(true)
        await expect(
          expect('.some-selector').not.to.be[method]().then(null)
        ).to.be.rejectedWith(
          `Expected element <.some-selector> to not be ${expectation} but it is`
        )
      })
      it(`resolves when element is not ${expectation}`, async function () {
        await expect('.some-selector').not.to.be[method]()
      })
      if (allowNone) {
        it(`resolves when element does not exist`, async function () {
          await expect(expect('.other-selector').not.to.be[method]())
        })
      } else {
        it(`rejects when element does not exist`, async function () {
          await expect(
            expect('.other-selector').not.to.be[method]().then(null)
          ).to.be.rejectedWith(
            `Expected element <.other-selector> to not be ${expectation} but no matching elements were found`
          )
        })
      }
    })
  })
