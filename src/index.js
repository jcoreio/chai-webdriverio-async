import existing from './assertions/existing'
import displayed from './assertions/displayed'
import count from './assertions/count'
import text from './assertions/text'
import value from './assertions/value'
import focused from './assertions/focused'
import enabled from './assertions/enabled'

export default function(client, options = {}) {
  return function chaiWebdriverIO(chai, utils) {
    const methodsToAdd = {
      existing,
      displayed,
      count,
      text,
      value,
      focus: focused,
      focused,
      enabled,
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
