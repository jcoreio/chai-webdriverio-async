/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

const count = (client, chai, utils, options) =>
  async function(expected) {
    const selector = utils.flag(this, 'object')

    const elements = await client.$$(selector)

    this.assert(
      elements.length === expected,
      `Expected <${selector}> to appear in the DOM ${expected} times, but it shows up ${
        elements.length
      } times instead.`,
      `Expected <${selector}> not to appear in the DOM ${expected} times, but it does.`
    )
  }

export default count
