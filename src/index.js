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

    function overwriteMethod(name, handler) {
      Assertion.overwriteMethod(name, function(_super) {
        return function chaiWebdriverIOAssertion(...args) {
          const ourFlag = utils.flag(this, 'chai-webdriverio-async')
          if (ourFlag) {
            return (async () => {
              const { getValueAndSelector, ...rest } = ourFlag
              const [value, selector] = await getValueAndSelector()
              return handler.call(this, {
                ...rest,
                _super,
                value,
                selector,
                args,
              })
            })()
          } else {
            _super.apply(this, args)
          }
        }
      })
    }

    function defaultOverwriteAssert(_super) {
      return function chaiWebdriverIOAssertion(...args) {
        const ourFlag = utils.flag(this, 'chai-webdriverio-async')
        if (ourFlag) {
          return (async () => {
            const { getValueAndSelector, message } = ourFlag
            const [value, selector] = await getValueAndSelector()
            const assertion = new Assertion(value)
            utils.transferFlags(this, assertion)
            utils.flag(assertion, 'object', value)
            if (message) {
              utils.flag(
                assertion,
                'message',
                [
                  utils.flag(this, 'message'),
                  message.replace(/#\{selector\}/g, `<${selector}>`),
                ]
                  .filter(Boolean)
                  .join(': ')
              )
            }
            return _super.apply(assertion, args)
          })()
        } else {
          _super.apply(this, args)
        }
      }
    }

    function defaultOverwriteMethod(name) {
      Assertion.overwriteMethod(name, defaultOverwriteAssert)
    }

    function defaultOverwriteChainableMethod(name) {
      Assertion.overwriteChainableMethod(
        name,
        defaultOverwriteAssert,
        chain => chain
      )
    }

    overwriteMethod('above', function assertAbove({
      value,
      selector,
      args: [n],
    }) {
      this.assert(
        value > n,
        `Expected <${selector}> to appear in the DOM more than #{exp} times, but it shows up #{act} times instead.`,
        `Expected <${selector}> not to appear in the DOM more than #{exp} times, but it shows up #{act} times instead.`,
        n,
        value
      )
    })

    overwriteMethod('least', function assertAtLeast({
      value,
      selector,
      args: [n],
    }) {
      this.assert(
        value >= n,
        `Expected <${selector}> to appear in the DOM at least #{exp} times, but it shows up #{act} times instead.`,
        `Expected <${selector}> not to appear in the DOM at least #{exp} times, but it shows up #{act} times instead.`,
        n,
        value
      )
    })

    overwriteMethod('below', function assertBelow({
      value,
      selector,
      args: [n],
    }) {
      this.assert(
        value < n,
        `Expected <${selector}> to appear in the DOM less than #{exp} times, but it shows up #{act} times instead.`,
        `Expected <${selector}> not to appear in the DOM less than #{exp} times, but it shows up #{act} times instead.`,
        n,
        value
      )
    })

    overwriteMethod('most', function assertAtMost({
      value,
      selector,
      args: [n],
    }) {
      this.assert(
        value <= n,
        `Expected <${selector}> to appear in the DOM at most #{exp} times, but it shows up #{act} times instead.`,
        `Expected <${selector}> not to appear in the DOM at most #{exp} times, but it shows up #{act} times instead.`,
        n,
        value
      )
    })

    overwriteMethod('within', function assertAtMost({
      value,
      selector,
      args: [lower, upper],
    }) {
      this.assert(
        value >= lower && value <= upper,
        `Expected <${selector}> to appear in the DOM between ${lower} and ${upper} times, but it shows up ${value} times instead.`,
        `Expected <${selector}> not to appear in the DOM between ${lower} and ${upper} times, but it shows up ${value} times instead.`
      )
    })

    defaultOverwriteMethod('members')
    defaultOverwriteMethod('oneOf')
    defaultOverwriteMethod('satisfy')
    defaultOverwriteChainableMethod('include')
    defaultOverwriteChainableMethod('includes')
    defaultOverwriteChainableMethod('contain')
    defaultOverwriteChainableMethod('contains')
  }
}
