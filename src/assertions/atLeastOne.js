/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

const atLeastOne = customize => (client, chai, utils, options) =>
  async function(expected) {
    const selector = utils.flag(this, 'object')

    const { predicate, errorMsg, errorMsgNegate, notFoundMessage } = customize(
      selector,
      expected
    )

    const elements = await client.$$(selector)
    if (!elements.length) throw new chai.AssertionError(notFoundMessage)

    const filteredList = (await Promise.all(elements.map(predicate))).filter(
      Boolean
    )

    this.assert(filteredList.length > 0, errorMsg, errorMsgNegate)
  }

export default atLeastOne
