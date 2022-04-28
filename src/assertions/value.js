/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import getElements from '../util/getElements'

const value = (client, chai, utils, options) => {
  async function assertValue(expected) {
    const negate = utils.flag(this, 'negate')

    const { getValueAndSelector } = utils.flag(this, 'chai-webdriverio-async')
    const [values, selector] = await getValueAndSelector()

    const expectedStr =
      typeof expected === 'string' ? JSON.stringify(expected) : expected

    if (!values.length) {
      throw new chai.AssertionError(
        negate
          ? `Expected element <${selector}> to not have value ${expectedStr}, but no matching elements were found`
          : `Expected element <${selector}> to have value ${expectedStr}, but no matching elements were found`
      )
    }

    const filteredList = values.filter(value =>
      expected instanceof RegExp ? value.match(expected) : value === expected
    )

    this.assert(
      filteredList.length > 0,
      `Expected element <${selector}> to have value ${expectedStr}, but only found: ${values
        .map(t => JSON.stringify(t))
        .join(', ')}`,
      `Expected element <${selector}> to not have value ${expectedStr}, but found: ${values
        .map(t => JSON.stringify(t))
        .join(', ')}`
    )
  }
  assertValue.chain = function chainValue() {
    const obj = utils.flag(this, 'object')
    utils.flag(this, 'chai-webdriverio-async', {
      type: 'value',
      message: `elements' values for #{selector}`,
      getValueAndSelector: async () => {
        const [elements, selector] = await getElements(obj, client)
        return [
          (await Promise.all(elements.map(e => e.getValue()))).flat(),
          selector,
        ]
      },
    })
  }
  return assertValue
}

export default value
