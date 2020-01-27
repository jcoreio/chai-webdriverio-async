/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import configWithDefaults from '../util/default-config'

const doesOneElementContainText = async function(client, selector, expected) {
  let elements = await client.$$(selector)
  let texts = []
  const filteredList = (await Promise.all(
    elements.map(async element => {
      const text = await element.getText()
      texts.push(text)
      return expected instanceof RegExp
        ? text.match(expected)
        : text === expected
    })
  )).filter(Boolean)

  return {
    result: filteredList.length > 0,
    texts,
  }
}

export default function text(client, chai, utils, options) {
  const config = configWithDefaults(options)

  chai.Assertion.addMethod('text', async function(expected) {
    const selector = utils.flag(this, 'object')
    const immediately = utils.flag(this, 'immediately')

    if (!immediately) {
      try {
        await client.waitUntil(
          async () =>
            (await doesOneElementContainText(client, selector, expected))
              .result,
          config.defaultWait
        )
      } catch (e) {
        // actual assertion is handled below
      }
    }

    const elementContainsText = await doesOneElementContainText(
      client,
      selector,
      expected
    )
    this.assert(
      elementContainsText.result,
      `Expected element <${selector}> to contain text "${expected}", but only found: ${
        elementContainsText.texts
      }`,
      `Expected element <${selector}> not to contain text "${expected}", but found: ${
        elementContainsText.texts
      }`
    )
  })
}
