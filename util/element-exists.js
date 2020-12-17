'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = assertElementExists

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator')
)

/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */
function assertElementExists(_x, _x2) {
  return _assertElementExists.apply(this, arguments)
}

function _assertElementExists() {
  _assertElementExists = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(client, selector) {
      var defaultWait,
        reverse,
        el,
        _args = arguments
      return _regenerator.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                defaultWait =
                  _args.length > 2 && _args[2] !== undefined ? _args[2] : 0
                reverse = _args.length > 3 ? _args[3] : undefined
                _context.prev = 2
                _context.next = 5
                return client.$(selector)

              case 5:
                el = _context.sent
                _context.next = 8
                return el.waitForExist(defaultWait, reverse)

              case 8:
                _context.next = 17
                break

              case 10:
                _context.prev = 10
                _context.t0 = _context['catch'](2)

                if (!reverse) {
                  _context.next = 16
                  break
                }

                throw new Error(
                  'Element with selector <'
                    .concat(selector, '> still exists after ')
                    .concat(defaultWait, 'ms (while waiting for it not to).')
                )

              case 16:
                throw new Error(
                  'Could not find element with selector <'
                    .concat(selector, '> within ')
                    .concat(defaultWait, 'ms')
                )

              case 17:
              case 'end':
                return _context.stop()
            }
          }
        },
        _callee,
        this,
        [[2, 10]]
      )
    })
  )
  return _assertElementExists.apply(this, arguments)
}
