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
    const { Assertion } = chai

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
      if (typeof method.chain === 'function') {
        Assertion.addChainableMethod(
          name,
          function() {
            const promise = method.apply(this, arguments)
            this._obj = promise
            this.then = promise.then.bind(promise)
            return this
          },
          method.chain
        )
      } else {
        Assertion.addMethod(name, function() {
          const promise = method.apply(this, arguments)
          this._obj = promise
          this.then = promise.then.bind(promise)
          return this
        })
      }
    }

    Assertion.overwriteMethod('above', function(_super) {
      return function assertAbove(n) {
        const ourFlag = utils.flag(this, 'chai-webdriverio-async')
        if (ourFlag) {
          return (async () => {
            const { getValueAndSelector } = ourFlag

            const [value, selector] = await getValueAndSelector()

            this.assert(
              value > n,
              `Expected <${selector}> to appear in the DOM more than #{exp} times, but it shows up #{act} times instead.`,
              `Expected <${selector}> not to appear in the DOM more than #{exp} times, but it shows up #{act} times instead.`,
              n,
              value
            )
          })()
        } else {
          _super.apply(this, arguments)
        }
      }
    })

    Assertion.overwriteMethod('least', function(_super) {
      return function assertAtLeast(n) {
        const ourFlag = utils.flag(this, 'chai-webdriverio-async')
        if (ourFlag) {
          return (async () => {
            const { getValueAndSelector } = ourFlag

            const [value, selector] = await getValueAndSelector()

            this.assert(
              value >= n,
              `Expected <${selector}> to appear in the DOM at least #{exp} times, but it shows up #{act} times instead.`,
              `Expected <${selector}> not to appear in the DOM at least #{exp} times, but it shows up #{act} times instead.`,
              n,
              value
            )
          })()
        } else {
          _super.apply(this, arguments)
        }
      }
    })

    Assertion.overwriteMethod('below', function(_super) {
      return function assertBelow(n) {
        const ourFlag = utils.flag(this, 'chai-webdriverio-async')
        if (ourFlag) {
          return (async () => {
            const { getValueAndSelector } = ourFlag

            const [value, selector] = await getValueAndSelector()

            this.assert(
              value < n,
              `Expected <${selector}> to appear in the DOM less than #{exp} times, but it shows up #{act} times instead.`,
              `Expected <${selector}> not to appear in the DOM less than #{exp} times, but it shows up #{act} times instead.`,
              n,
              value
            )
          })()
        } else {
          _super.apply(this, arguments)
        }
      }
    })

    Assertion.overwriteMethod('most', function(_super) {
      return function assertAtMost(n) {
        const ourFlag = utils.flag(this, 'chai-webdriverio-async')
        if (ourFlag) {
          return (async () => {
            const { getValueAndSelector } = ourFlag

            const [value, selector] = await getValueAndSelector()

            this.assert(
              value <= n,
              `Expected <${selector}> to appear in the DOM at most #{exp} times, but it shows up #{act} times instead.`,
              `Expected <${selector}> not to appear in the DOM at most #{exp} times, but it shows up #{act} times instead.`,
              n,
              value
            )
          })()
        } else {
          _super.apply(this, arguments)
        }
      }
    })
  }
}
