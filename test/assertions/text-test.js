/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import FakeClient from '../stubs/fake-client'
import FakeElement from '../stubs/fake-element'
import text from '../../src/assertions/text'
import immediately from '../../src/chains/immediately'

const fakeClient = new FakeClient()
const fakeElement1 = new FakeElement()
const fakeElement2 = new FakeElement()

//Using real chai, because it would be too much effort to stub/mock everything
chai.use((chai, utils) => text(fakeClient, chai, utils))
chai.use((chai, utils) => immediately(fakeClient, chai, utils))

chai.use(sinonChai)

describe('text', () => {
  beforeEach(() => {
    fakeClient.__resetStubs__()
    fakeElement1.__resetStubs__()
    fakeElement2.__resetStubs__()
  })

  context("when element doesn't exist", () => {
    beforeEach(() => {
      fakeClient.$$.withArgs('.some-selector').resolves([])
    })

    it("Should throw element doesn't exist error for strings", async () => {
      await expect(expect('.some-selector').to.have.text('blablabla')).to.be
        .rejected
    })
    it("Should throw element doesn't exist error for regular expressions", async () => {
      await expect(expect('.some-selector').to.have.text(/blablabla/)).to.be
        .rejected
    })
  })

  describe('When element exists', () => {
    let elementText = 'Never gonna give you up'

    beforeEach(() => {
      fakeElement1.getText.resolves(elementText)
      fakeClient.$$.withArgs('.some-selector').resolves([fakeElement1])
    })

    describe('When call is chained with Immediately', () => {
      it('Should not wait till the element exists', async () => {
        await expect('.some-selector')
          .to.have.immediately()
          .text(elementText)
        expect(fakeClient.waitUntil).to.not.have.been.called
      })
      it('Should not throw an exception', async () => {
        await expect('.some-selector')
          .to.have.immediately()
          .text(elementText)
      })
      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(
            expect('.some-selector')
              .to.not.have.immediately()
              .text(elementText)
          ).to.be.rejected
        })
      })
    })

    describe('When element text matches string expectation', () => {
      it('Should not throw an error', async () => {
        await expect('.some-selector').to.have.text(elementText)
      })

      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(expect('.some-selector').to.not.have.text(elementText))
            .to.be.rejected
        })
      })
    })

    describe('When element text matches regex expectation', () => {
      it('Should not throw an error', async () => {
        await expect('.some-selector').to.have.text(/gon+a give/)
      })

      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(expect('.some-selector').to.not.have.text(/gon+a give/))
            .to.be.rejected
        })
      })
    })

    describe('When element text does not match string expectation', () => {
      it('Should throw an error', async () => {
        await expect(
          expect('.some-selector').to.have.text("dis don't match jack! 1#43@")
        ).to.be.rejected
      })

      describe('When negated', () => {
        it('Should not throw an error', async () => {
          await expect('.some-selector').to.not.have.text(
            "dis don't match jack! 1#43@"
          )
        })
      })
    })

    describe('When element text does not match regex expectation', () => {
      it('Should throw an error', async () => {
        await expect(
          expect('.some-selector').to.have.text(/dis don't match jack! 1#43@/)
        ).to.be.rejected
      })

      describe('When negated', () => {
        it('Should not throw an error', async () => {
          await expect('.some-selector').to.not.have.text(
            /dis don't match jack! 1#43@/
          )
        })
      })
    })
  })

  describe('When multiple elements exists', () => {
    let elementTexts = ['Never gonna give you up', 'Never gonna let you down']
    beforeEach(() => {
      fakeElement1.getText.resolves(elementTexts[0])
      fakeElement2.getText.resolves(elementTexts[1])
      fakeClient.$$.withArgs('.some-selector').resolves([
        fakeElement1,
        fakeElement2,
      ])
    })

    describe("When at least one element's text matches string expectation", () => {
      it('Should not throw an error', async () => {
        await expect('.some-selector').to.have.text(elementTexts[0])
      })

      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(
            expect('.some-selector').to.not.have.text(elementTexts[0])
          ).to.be.rejected
        })
      })
    })

    describe("When at least one element's text matches regex expectation", () => {
      it('Should not throw an error', async () => {
        await expect('.some-selector').to.have.text(/gon+a give/)
      })

      describe('When negated', () => {
        it('Should throw an error', async () => {
          await expect(expect('.some-selector').to.not.have.text(/gon+a give/))
            .to.be.rejected
        })
      })
    })

    describe('When no element text matches string expectation', () => {
      it('Should throw an error', async () => {
        await expect(
          expect('.some-selector').to.have.text("dis don't match jack! 1#43@")
        ).to.be.rejected
      })

      describe('When negated', () => {
        it('Should not throw an error', async () => {
          await expect('.some-selector').to.not.have.text(
            "dis don't match jack! 1#43@"
          )
        })
      })
    })

    describe('When no element text matches regex expectation', () => {
      it('Should throw an error', async () => {
        await expect(
          expect('.some-selector').to.have.text(/dis don't match jack! 1#43@/)
        ).to.be.rejected
      })

      describe('When negated', () => {
        it('Should not throw an error', async () => {
          await expect('.some-selector').to.not.have.text(
            /dis don't match jack! 1#43@/
          )
        })
      })
    })
  })
})
