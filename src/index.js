import attribute from './assertions/attribute'
import clickable from './assertions/clickable'
import count from './assertions/count'
import displayed from './assertions/displayed'
import displayedInViewport from './assertions/displayedInViewport'
import enabled from './assertions/enabled'
import existing from './assertions/existing'
import focused from './assertions/focused'
import selected from './assertions/selected'
import text from './assertions/text'
import value from './assertions/value'

export default function(client, options = {}) {
  return function chaiWebdriverIO(chai, utils) {
    const methodsToAdd = {
      attribute,
      clickable,
      count,
      displayed,
      displayedInViewport,
      enabled,
      existing,
      focus: focused,
      focused,
      selected,
      text,
      value,
    }

    for (const name in methodsToAdd) {
      const method = methodsToAdd[name](client, chai, utils, options)
      utils.addMethod(chai.Assertion.prototype, name, function() {
        const promise = method.apply(this, arguments)
        this._obj = promise
        this.then = promise.then.bind(promise)
        return this
      })
    }
  }
}
