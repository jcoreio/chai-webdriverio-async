'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator')
)

var doesOneElementSatisfy = function doesOneElementSatisfy(predicate) {
  return (
    /*#__PURE__*/
    (function() {
      var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(client, selector) {
          var elements, filteredList
          return _regenerator.default.wrap(
            function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    _context.next = 2
                    return client.$$(selector)

                  case 2:
                    elements = _context.sent
                    _context.next = 5
                    return Promise.all(elements.map(predicate))

                  case 5:
                    _context.t0 = Boolean
                    filteredList = _context.sent.filter(_context.t0)
                    return _context.abrupt('return', filteredList.length > 0)

                  case 8:
                  case 'end':
                    return _context.stop()
                }
              }
            },
            _callee,
            this
          )
        })
      )

      return function(_x, _x2) {
        return _ref.apply(this, arguments)
      }
    })()
  )
}

var _default = doesOneElementSatisfy
exports.default = _default
