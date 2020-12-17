/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

import booleanAssertion from './booleanAssertion'

export default booleanAssertion({
  predicate: el => el.isEnabled(),
  expectation: 'enabled',
  allowNone: false,
})
