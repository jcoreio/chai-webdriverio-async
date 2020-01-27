/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import configWithDefaults from '../util/default-config'
import doesOneElementSatisfy from '../util/doesOneElementSatisfy'

const isOneElementDisplayed = doesOneElementSatisfy(el => el.isDisplayed())

export default function displayed(client, chai, utils, options) {
  const config = configWithDefaults(options)

  chai.Assertion.addMethod('displayed', async function() {
    const negate = utils.flag(this, 'negate')
    const selector = utils.flag(this, 'object')
    const immediately = utils.flag(this, 'immediately')

    const errorMsg = `Expected <${selector}> to be displayed but it is not`
    const errorMsgNegate = `Expected <${selector}> to not be displayed but it is`

    if (!immediately) {
      await client.waitUntil(
        async () => (await isOneElementDisplayed(client, selector)) === !negate,
        config.defaultWait,
        negate ? errorMsgNegate : errorMsg
      )
    }

    this.assert(
      await isOneElementDisplayed(client, selector),
      errorMsg,
      errorMsgNegate
    )
  })
}
