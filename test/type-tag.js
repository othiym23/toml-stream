var test = require('tap').test

var typeTag = require('../lib/type-tag.js')

test('getting type tags from objects', function (t) {
  t.equal(typeTag('hello'), 'string', 'recognized string')
  t.equal(typeTag(17), 'number', 'recognized integer')
  t.equal(typeTag(2.71), 'number', 'recognized floating-point')
  t.equal(typeTag(new Date()), 'date', 'recognized date')
  t.equal(typeTag(false), 'boolean', 'recognized boolean literal')
  t.equal(typeTag([]), 'array', 'recognized array')
  t.equal(typeTag(undefined), 'undefined', 'recognized undefined / other value type')
  t.equal(typeTag(/hello/), 'object', 'recognized RegExp as object')
  t.equal(typeTag({}), 'object', 'recognized object literal as object')

  t.end()
})
