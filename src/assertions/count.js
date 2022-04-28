/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import getElements from '../util/getElements'

const count = (client, chai, utils, options) => {
  async function assertCount(expected) {
    const { getValueAndSelector } = utils.flag(this, 'chai-webdriverio-async')
    const [count, selector] = await getValueAndSelector()

    this.assert(
      count === expected,
      `Expected <${selector}> to appear in the DOM ${expected} times, but it shows up ${count} times instead.`,
      `Expected <${selector}> not to appear in the DOM ${expected} times, but it does.`
    )
  }
  assertCount.chain = function chainCount() {
    const obj = utils.flag(this, 'object')
    utils.flag(this, 'chai-webdriverio-async', {
      type: 'count',
      getValueAndSelector: async () => {
        const [elements, selector] = await getElements(obj, client)
        return [(await Promise.all(elements)).flat().length, selector]
      },
    })
  }
  return assertCount
}

export default count
