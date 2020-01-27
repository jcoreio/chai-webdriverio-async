/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import configWithDefaults from '../util/default-config'

const doesOneElementHaveValue = async function(client, selector, expected) {
  const elements = await client.$$(selector)
  const values = []
  const filteredList = (await Promise.all(
    elements.map(async element => {
      const value = await element.getValue()
      values.push(value)
      return expected instanceof RegExp
        ? value.match(expected)
        : value === expected
    })
  )).filter(Boolean)

  return {
    result: filteredList.length > 0,
    values,
  }
}

export default function value(client, chai, utils, options) {
  const config = configWithDefaults(options)
  chai.Assertion.addMethod('value', async function(expected) {
    const selector = utils.flag(this, 'object')
    const immediately = utils.flag(this, 'immediately')

    if (!immediately) {
      try {
        client.waitUntil(
          async () =>
            (await doesOneElementHaveValue(client, selector, expected)).result,
          config.defaultWait
        )
      } catch (e) {
        // actual assertion is handled below
      }
    }

    const elementContainsValue = await doesOneElementHaveValue(
      client,
      selector,
      expected
    )
    this.assert(
      elementContainsValue.result,
      `Expected an element matching <${selector}> to contain value "${expected}", but only found these values: ${
        elementContainsValue.values
      }`,
      `Expected an element matching <${selector}> not to contain value "${expected}", but found these values: ${
        elementContainsValue.values
      }`
    )
  })
}
