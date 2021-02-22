/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import getElements from '../util/getElements'

const text = (client, chai, utils, options) => {
  async function assertText(expected) {
    const negate = utils.flag(this, 'negate')

    const { getValueAndSelector } = utils.flag(this, 'chai-webdriverio-async')
    const [texts, selector] = await getValueAndSelector()

    const expectedStr =
      typeof expected === 'string' ? JSON.stringify(expected) : expected

    if (!texts.length) {
      throw new chai.AssertionError(
        negate
          ? `Expected element <${selector}> to not have text ${expectedStr}, but no matching elements were found`
          : `Expected element <${selector}> to have text ${expectedStr}, but no matching elements were found`
      )
    }

    const filteredList = texts.filter(text =>
      expected instanceof RegExp ? text.match(expected) : text === expected
    )

    this.assert(
      filteredList.length > 0,
      `Expected element <${selector}> to have text ${expectedStr}, but only found: ${texts
        .map(t => JSON.stringify(t))
        .join(', ')}`,
      `Expected element <${selector}> to not have text ${expectedStr}, but found: ${texts
        .map(t => JSON.stringify(t))
        .join(', ')}`
    )
  }
  assertText.chain = function chainText() {
    const obj = utils.flag(this, 'object')
    utils.flag(this, 'chai-webdriverio-async', {
      type: 'text',
      message: `elements' text for #{selector}`,
      getValueAndSelector: async () => {
        const [elements, selector] = await getElements(obj, client)
        return [await Promise.all(elements.map(e => e.getText())), selector]
      },
    })
  }
  return assertText
}

export default text
