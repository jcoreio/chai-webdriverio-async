/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import FakeClient from '../stubs/fake-client'
import FakeElement from '../stubs/fake-element'
import immediately from '../../src/chains/immediately'
import value from '../../src/assertions/value'

const fakeClient = new FakeClient()
const fakeElement1 = new FakeElement()
const fakeElement2 = new FakeElement()

//Using real chai, because it would be too much effort to stub/mock everything
chai.use((chai, utils) => value(fakeClient, chai, utils))
chai.use((chai, utils) => immediately(fakeClient, chai, utils))

chai.use(sinonChai)

describe('value', () => {
  beforeEach(() => {
    fakeClient.__resetStubs__()
    fakeElement1.__resetStubs__()
    fakeElement2.__resetStubs__()

    fakeClient.$$.resolves([fakeElement1])
  })

  it("Should throw element doesn't exist error", async () => {
    await expect(expect('.some-selector').to.have.value('blablabla')).to.be
      .rejected
  })

  describe('When matching element exists', () => {
    let testResult = 'Never gonna give you up'
    beforeEach(() => {
      fakeElement1.getValue.resolves(testResult)
    })

    describe('When call is chained with Immediately', () => {
      it('Should not wait till the element exists', async () => {
        await expect('.some-selector')
          .to.have.immediately()
          .value(testResult)
        expect(fakeClient.waitUntil).to.not.have.been.called
      })
      it('Should not throw an exception', async () => {
        await expect('.some-selector')
          .to.have.immediately()
          .value(testResult)
      })
      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(
            expect('.some-selector')
              .to.not.have.immediately()
              .value(testResult)
          ).to.be.rejected
        })
      })
    })

    describe('When element value matches string expectation', () => {
      it('Should not throw an error', async () => {
        await expect('.some-selector').to.have.value(testResult)
      })

      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(expect('.some-selector').to.not.have.value(testResult))
            .to.be.rejected
        })
      })
    })

    describe('When element value matches regex expectation', () => {
      it('Should not throw an error', async () => {
        await expect('.some-selector').to.have.value(/gon+a give/)
      })

      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(expect('.some-selector').to.not.have.value(/gon+a give/))
            .to.be.rejected
        })
      })
    })

    describe('When element value does not match string expectation', () => {
      it('Should throw an error', async () => {
        await expect(
          expect('.some-selector').to.have.value("dis don't match jack! 1#43@")
        ).to.be.rejected
      })

      describe('When negated', () => {
        it('Should not throw an error', async () => {
          await expect('.some-selector').to.not.have.value(
            "dis don't match jack! 1#43@"
          )
        })
      })
    })

    describe('When element value does not match regex expectation', () => {
      it('Should throw an error', async () => {
        await expect(
          expect('.some-selector').to.have.value(/dis don't match jack! 1#43@/)
        ).to.be.rejected
      })

      describe('When negated', () => {
        it('Should not throw an error', async () => {
          await expect('.some-selector').to.not.have.value(
            /dis don't match jack! 1#43@/
          )
        })
      })
    })
  })

  describe('When multiple elements match', () => {
    let testResult = ['Never gonna give you up', 'Never gonna let you down']
    beforeEach(() => {
      fakeElement1.getValue.resolves(testResult[0])
      fakeElement2.getValue.resolves(testResult[1])
      fakeClient.$$.resolves([fakeElement1, fakeElement2])
    })

    describe('When at least one element value matches string expectation', () => {
      it('Should not throw an error', async () => {
        await expect('.some-selector').to.have.value(testResult[0])
      })

      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(
            expect('.some-selector').to.not.have.value(testResult[0])
          ).to.be.rejected
        })
      })
    })

    describe('When at least one element value matches regex expectation', () => {
      it('Should not throw an error', async () => {
        await expect('.some-selector').to.have.value(/gon+a give/)
      })

      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(expect('.some-selector').to.not.have.value(/gon+a give/))
            .to.be.rejected
        })
      })
    })

    describe('When no element value matches string expectation', () => {
      it('Should throw an error', async () => {
        await expect(
          expect('.some-selector').to.have.value("dis don't match jack! 1#43@")
        ).to.be.rejected
      })

      describe('When negated', () => {
        it('Should not throw an error', async () => {
          await expect('.some-selector').to.not.have.value(
            "dis don't match jack! 1#43@"
          )
        })
      })
    })

    describe('When no element value matches regex expectation', () => {
      it('Should throw an error', async () => {
        await expect(
          expect('.some-selector').to.have.value(/dis don't match jack! 1#43@/)
        ).to.be.rejected
      })

      describe('When negated', () => {
        it('Should not throw an error', async () => {
          await expect('.some-selector').to.not.have.value(
            /dis don't match jack! 1#43@/
          )
        })
      })
    })
  })
})
