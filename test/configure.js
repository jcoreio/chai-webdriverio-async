/* eslint-env node */

import { before } from 'mocha'
import chai from 'chai'
import asPromised from 'chai-as-promised'
chai.use(asPromised)

if (process.argv.indexOf('--watch') >= 0) {
  before(() => process.stdout.write('\u001b[2J\u001b[1;1H\u001b[3J'))
}
