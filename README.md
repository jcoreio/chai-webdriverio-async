# chai-webdriverio-async

[![CircleCI](https://circleci.com/gh/jcoreio/chai-webdriverio-async.svg?style=svg)](https://circleci.com/gh/jcoreio/chai-webdriverio-async)
[![Coverage Status](https://codecov.io/gh/jcoreio/chai-webdriverio-async/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/chai-webdriverio-async)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/chai-webdriverio-async.svg)](https://badge.fury.io/js/chai-webdriverio-async)

Async fork of [chai-webdriverio](https://github.com/marcodejongh/chai-webdriverio).

Provides async [webdriverio](https://npmjs.org/package/webdriverio) sugar for the [Chai](http://chaijs.com/) assertion library. Allows you to create expressive integration tests:

```javascript
await expect('.frequency-field').to.have.text('One time')
await expect('.toggle-pane').to.not.be.displayed()
```

## What sorts of assertions can we make?

All assertions start with a [WebdriverIO-compatible selector](http://webdriver.io/guide/usage/selectors.html), for example:

- `expect('.list')` (CSS selector)
- `expect('a[href=http://google.com]')` (CSS Selector)
- `expect('//BODY/DIV[6]/DIV[1]')` (XPath selector)
- `expect('a*=Save')` (Text selector)

Then, we can add our assertion to the chain.

- `await expect(selector).to.be.existing()` - Test whether [at least one] matching element exists in the DOM
- `await expect(selector).to.be.displayed()` - Test whether or not [at least one] matching element is displayed
- `await expect(selector).to.be.focused()` - Test whether or not [at least one] matching element is focused
- `await expect(selector).to.have.text('string')` - Test the text value of the selected element(s) against supplied string. Succeeds if at least one element matches exactly
- `await expect(selector).to.have.text(/regex/)` - Test the text value of the selected element(s) against the supplied regular expression. Succeeds if at least one element matches
- `await expect(selector).to.have.count(number)` - Test how many elements exist in the DOM with the supplied selector
- `await expect(selector).to.have.value('x')` - Test that [at least one] selected element has the given value
- `await expect(selector).to.have.focus()` - (alias for `to.be.focused()`)

You can also always add a `not` in there to negate the assertion:

- `await expect(selector).not.to.have.text('property')`

## Setup

Setup is pretty easy. Just:

```javascript
var chai = require('chai')
var chaiWebdriver = require('chai-webdriverio').default
chai.use(chaiWebdriver(browser))

// And you're good to go!
await browser.url('http://github.com')
await chai
  .expect('#site-container h1.heading')
  .to.not.contain.text("I'm a kitty!")
```

## Compatability

### WebdriverIO

Only intended to be compatible with Webdriver 5/6 right now.

### Node.js

Requires Node.js 8.x

**Contributors:**

- [@mltsy](https://github.com/mltsy) : `exist`, `text` assertions, documentation & test adjustments

## License

Apache 2.0
