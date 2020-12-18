/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

const attribute = (client, chai, utils, options) =>
  async function(attribute, expected) {
    const selector = utils.flag(this, 'object')
    const negate = utils.flag(this, 'negate')

    if (arguments.length === 1) {
      const elements = await client.$$(selector)
      if (!elements.length) {
        throw new chai.AssertionError(
          negate
            ? `Expected element <${selector}> to not have attribute ${attribute}, but no matching elements were found`
            : `Expected element <${selector}> to have attribute ${attribute}, but no matching elements were found`
        )
      }

      const values = []
      const filteredList = (await Promise.all(
        elements.map(async element => {
          const value = await element.getAttribute(attribute)
          values.push(value)
          return value !== undefined
        })
      )).filter(Boolean)

      this.assert(
        filteredList.length > 0,
        `Expected element <${selector}> to have attribute ${attribute}, but only found: ${values
          .map(t => JSON.stringify(t))
          .join(', ')}`,
        `Expected element <${selector}> to not have attribute ${attribute}, but found: ${values
          .map(t => JSON.stringify(t))
          .join(', ')}`
      )
      return
    }

    const expectedStr =
      typeof expected === 'string' ? JSON.stringify(expected) : expected

    const elements = await client.$$(selector)
    if (!elements.length) {
      throw new chai.AssertionError(
        negate
          ? `Expected element <${selector}> to not have attribute ${attribute} with value ${expectedStr}, but no matching elements were found`
          : `Expected element <${selector}> to have attribute ${attribute} with value ${expectedStr}, but no matching elements were found`
      )
    }

    const values = []
    const filteredList = (await Promise.all(
      elements.map(async element => {
        const value = await element.getAttribute(attribute)
        values.push(value)
        return (
          value !== undefined &&
          (expected instanceof RegExp
            ? value.match(expected)
            : value === expected)
        )
      })
    )).filter(Boolean)

    this.assert(
      filteredList.length > 0,
      `Expected element <${selector}> to have attribute ${attribute} with value ${expectedStr}, but only found: ${values
        .map(t => JSON.stringify(t))
        .join(', ')}`,
      `Expected element <${selector}> to not have attribute ${attribute} with value ${expectedStr}, but found: ${values
        .map(t => JSON.stringify(t))
        .join(', ')}`
    )
  }

export default attribute
