/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import getElements from '../util/getElements'

const count = (client, chai, utils, options) =>
  async function(expected) {
    const [elements, selector] = await getElements(
      utils.flag(this, 'object'),
      client
    )

    this.assert(
      elements.length === expected,
      `Expected <${selector}> to appear in the DOM ${expected} times, but it shows up ${
        elements.length
      } times instead.`,
      `Expected <${selector}> not to appear in the DOM ${expected} times, but it does.`
    )
  }

export default count
