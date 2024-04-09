/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import getElements from '../util/getElements'

const booleanAssertion =
  ({ predicate, expectation, allowNone }) =>
  (client, chai, utils, options) =>
    async function (expected) {
      const negate = utils.flag(this, 'negate')

      const [elements, selector] = await getElements(
        utils.flag(this, 'object'),
        client
      )
      this.assert(
        negate ^ (allowNone || elements.length > 0),
        `Expected element <${selector}> to be ${expectation} but no matching elements were found`,
        `Expected element <${selector}> to not be ${expectation} but no matching elements were found`
      )

      const filteredList = (await Promise.all(elements.map(predicate))).filter(
        Boolean
      )

      this.assert(
        filteredList.length > 0,
        `Expected element <${selector}> to be ${expectation} but it is not`,
        `Expected element <${selector}> to not be ${expectation} but it is`
      )
    }

export default booleanAssertion
