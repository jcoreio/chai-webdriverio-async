/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import configWithDefaults from '../util/default-config'

async function hasCount(client, selector, count, countStore) {
  const elements = await client.$$(selector)
  countStore.count = elements.length
  return elements.length === count
}

async function waitUntilCount(
  client,
  selector,
  count,
  defaultWait = 0,
  reverse
) {
  const countStore = {}

  if (!reverse) {
    try {
      await client.waitUntil(
        () => hasCount(client, selector, count, countStore),
        defaultWait
      )
    } catch (error) {
      throw new Error(
        `Element with selector <${selector}> does not appear in the DOM ${count} times ` +
          `within ${defaultWait} ms, but it shows up ${
            countStore.count
          } times instead.`
      )
    }
  } else {
    await client.waitUntil(
      async () => !(await hasCount(client, selector, count, countStore)),
      defaultWait,
      `Element with selector <${selector}> still appears in the DOM ${count} times after ${defaultWait} ms`
    )
  }
}

export default function count(client, chai, utils, options) {
  const config = configWithDefaults(options)
  chai.Assertion.addMethod('count', async function(expected) {
    const selector = utils.flag(this, 'object')
    const negate = utils.flag(this, 'negate')
    const immediately = utils.flag(this, 'immediately')

    if (!immediately) {
      await waitUntilCount(
        client,
        selector,
        expected,
        config.defaultWait,
        negate
      )
    }

    const countStore = {}

    this.assert(
      await hasCount(client, selector, expected, countStore),
      `Expected <${selector}> to appear in the DOM ${expected} times, but it shows up ${
        countStore.count
      } times instead.`,
      `Expected <${selector}> not to appear in the DOM ${expected} times, but it does.`
    )
  })
}
