/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

const text = (client, chai, utils, options) =>
  async function(expected) {
    const selector = utils.flag(this, 'object')
    const negate = utils.flag(this, 'negate')

    const expectedStr =
      typeof expected === 'string' ? JSON.stringify(expected) : expected

    const elements = await client.$$(selector)
    if (!elements.length) {
      throw new chai.AssertionError(
        negate
          ? `Expected element <${selector}> to not have text ${expectedStr}, but no matching elements were found`
          : `Expected element <${selector}> to have text ${expectedStr}, but no matching elements were found`
      )
    }

    const texts = []
    const filteredList = (await Promise.all(
      elements.map(async element => {
        const text = await element.getText()
        texts.push(text)
        return expected instanceof RegExp
          ? text.match(expected)
          : text === expected
      })
    )).filter(Boolean)

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

export default text
