/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import FakeClient from '../stubs/fake-client'
import FakeElement from '../stubs/fake-element'
import enabled from '../../src/assertions/enabled'
import immediately from '../../src/chains/immediately'

//Using real chai, because it would be too much effort to stub/mock everything
chai.use(sinonChai)

describe('enabled', () => {
  let fakeClient
  let fakeElement1
  let fakeElement2

  beforeEach(() => {
    fakeClient = new FakeClient()
    fakeElement1 = new FakeElement()
    fakeElement2 = new FakeElement()

    fakeElement1.isEnabled.resolves(false)
    fakeClient.$$.withArgs('.some-selector').resolves([fakeElement1])

    chai.use((chai, utils) => enabled(fakeClient, chai, utils))
    chai.use((chai, utils) => immediately(fakeClient, chai, utils))
  })

  afterEach(() => {
    fakeClient.__resetStubs__()
    fakeElement1.__resetStubs__()
    fakeElement2.__resetStubs__()
  })

  describe('When not negated', () => {
    beforeEach(async () => {
      fakeElement1.isEnabled.resolves(true)

      await expect('.some-selector').to.be.enabled()
    })

    it('Should call `isEnabled`', () => {
      expect(fakeElement1.isEnabled).to.have.been.calledWith()
    })
  })

  describe('When negated', () => {
    beforeEach(async () => {
      await expect('.some-selector').to.not.be.enabled()
    })

    it('Should call `isEnabled`', () => {
      expect(fakeElement1.isEnabled).to.have.been.calledWith()
    })
  })

  describe('When the element is enabled', () => {
    beforeEach(() => {
      fakeElement1.isEnabled.resolves(true)
    })

    it('Should not throw an exception', async () => {
      await expect('.some-selector').to.be.enabled()
    })

    describe('When given a default wait time', () => {
      beforeEach(async () => {
        chai.use((chai, utils) =>
          enabled(fakeClient, chai, utils, { defaultWait: 100 })
        )

        await expect('.some-selector').to.be.enabled()
      })

      it('Should call `waitUntil`', () => {
        expect(fakeClient.waitUntil).to.have.been.calledWith()
      })
    })

    describe('When the call is chained with `immediately`', () => {
      beforeEach(async () => {
        await expect('.some-selector')
          .to.be.immediately()
          .enabled()
      })

      it('Should not wait for the element to be enabled', () => {
        expect(fakeClient.waitUntil).to.not.have.been.called
      })
    })

    describe('When the assertion is negated', () => {
      it('Should throw an exception', async () => {
        await expect(expect('.some-selector').to.not.be.enabled()).to.be
          .rejected
      })
    })
  })

  describe('When the element is not enabled', () => {
    beforeEach(() => {
      fakeElement1.isEnabled.resolves(false)
    })

    it('Should throw an exception', async () => {
      await expect(expect('.some-selector').to.be.enabled()).to.be.rejected
    })

    describe('When the assertion is negated', () => {
      it('Should not throw an exception', async () => {
        await expect('.some-selector').to.not.be.enabled()
      })
    })
  })

  describe('When multiple matching elements exist', () => {
    describe('When any one is enabled', () => {
      beforeEach(() => {
        fakeElement1.isEnabled.resolves(true)
        fakeElement2.isEnabled.resolves(false)
        fakeClient.$$.withArgs('.multiple-selector').resolves([
          fakeElement1,
          fakeElement2,
        ])
      })

      it('Should not throw an exception', async () => {
        await expect('.multiple-selector').to.be.enabled()
      })

      describe('When the call is chained with `immediately`', () => {
        beforeEach(async () => {
          await expect('.multiple-selector')
            .to.be.immediately()
            .enabled()
        })

        it('Should not wait for the element to be enabled', () => {
          expect(fakeClient.waitUntil).to.not.have.been.called
        })
      })

      describe('When the assertion is negated', () => {
        it('Should throw an exception', async () => {
          await expect(expect('.multiple-selector').to.not.be.enabled()).to.be
            .rejected
        })
      })
    })

    describe('When none are enabled', () => {
      beforeEach(() => {
        fakeElement1.isEnabled.resolves(false)
        fakeElement2.isEnabled.resolves(false)
        fakeClient.$$.withArgs('.multiple-selector').resolves([
          fakeElement1,
          fakeElement2,
        ])
      })

      it('Should throw an exception', async () => {
        await expect(expect('.multiple-selector').to.be.enabled()).to.be
          .rejected
      })

      describe('When the assertion is negated', () => {
        it('Should not throw an exception', async () => {
          await expect('.multiple-selector').to.not.be.enabled()
        })
      })
    })
  })
})
