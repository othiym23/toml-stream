var test = require('tap').test
var TOMLCodec = require('../lib/codecs/toml.js').default

test('TOML base class', function (t) {
  var toml
  t.doesNotThrow(function () {
    toml = new TOMLCodec()
  }, 'can create the base class')

  var encodedKey
  t.doesNotThrow(function () {
    encodedKey = toml._encodeKey('key')
  })
  t.equals(encodedKey, 'key', 'key encodes correctly')

  t.throws(function () {
    toml._encodeValue([])
  }, 'but _encodeValue must be overridden by child classes')

  t.throws(function () {
    toml.encode({ v: [] })
  }, "and so encode can't be called either.")

  t.end()
})
