/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import configWithDefaults from '../util/default-config'
import doesOneElementSatisfy from '../util/doesOneElementSatisfy'

const isOneElementFocused = doesOneElementSatisfy(el => el.isFocused())

export default function focus(client, chai, utils, options) {
  const config = configWithDefaults(options)

  chai.Assertion.addMethod('focus', async function() {
    const negate = utils.flag(this, 'negate')
    const selector = utils.flag(this, 'object')
    const immediately = utils.flag(this, 'immediately')

    const errorMsg = `Expected <${selector}> to be focused but it is not`
    const errorMsgNegate = `Expected <${selector}> to not be focused but it is`

    if (!immediately) {
      await client.waitUntil(
        async () => (await isOneElementFocused(client, selector)) === !negate,
        config.defaultWait,
        negate ? errorMsgNegate : errorMsg
      )
    }

    this.assert(
      await isOneElementFocused(client, selector),
      errorMsg,
      errorMsgNegate
    )
  })
}
