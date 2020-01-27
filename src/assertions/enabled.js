/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import configWithDefaults from '../util/default-config'
import doesOneElementSatisfy from '../util/doesOneElementSatisfy'

const isOneElementEnabled = doesOneElementSatisfy(el => el.isEnabled())

export default function enabled(client, chai, utils, options) {
  const config = configWithDefaults(options)

  chai.Assertion.addMethod('enabled', async function() {
    const negate = utils.flag(this, 'negate')
    const selector = utils.flag(this, 'object')
    const immediately = utils.flag(this, 'immediately')

    const errorMsg = `Expected <${selector}> to be enabled but it is not`
    const errorMsgNegate = `Expected <${selector}> to not be enabled but it is`

    if (!immediately) {
      await client.waitUntil(
        async () => (await isOneElementEnabled(client, selector)) === !negate,
        config.defaultWait,
        negate ? errorMsgNegate : errorMsg
      )
    }

    this.assert(
      await isOneElementEnabled(client, selector),
      errorMsg,
      errorMsgNegate
    )
  })
}
