/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

const booleanAssertion = ({ predicate, expectation, allowNone }) => (
  client,
  chai,
  utils,
  options
) =>
  async function(expected) {
    const selector = utils.flag(this, 'object')
    const negate = utils.flag(this, 'negate')

    const elements = await client.$$(selector)
    if (!allowNone && !elements.length) {
      throw new chai.AssertionError(
        negate
          ? `Expected <${selector}> to not be ${expectation} but no matching elements were found`
          : `Expected <${selector}> to be ${expectation} but no matching elements were found`
      )
    }

    const filteredList = (await Promise.all(elements.map(predicate))).filter(
      Boolean
    )

    this.assert(
      filteredList.length > 0,
      `Expected <${selector}> to be ${expectation} but it is not`,
      `Expected <${selector}> to not be ${expectation} but it is`
    )
  }

export default booleanAssertion
