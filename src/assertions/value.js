/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import getElements from '../util/getElements'

const value = (client, chai, utils, options) =>
  async function(expected) {
    const negate = utils.flag(this, 'negate')

    const expectedStr =
      typeof expected === 'string' ? JSON.stringify(expected) : expected

    const [elements, selector] = await getElements(
      utils.flag(this, 'object'),
      client
    )
    if (!elements.length) {
      throw new chai.AssertionError(
        negate
          ? `Expected element <${selector}> to not have value ${expectedStr}, but no matching elements were found`
          : `Expected element <${selector}> to have value ${expectedStr}, but no matching elements were found`
      )
    }

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

export default value
