var test = require('tap').test
var toml = require('toml')
var toTOMLString = require('../').toTOMLString

test('arrays to TOML', function (t) {
  t.test('with an empty array', function (t) {
    var input = { irie: [] }

    toTOMLString(input, function (er, output) {
      t.ifError(er, 'empty array successfully converted')

      if (!er) {
        t.equals(output, 'irie = [  ]\n')
        t.same(toml.parse(output), input, 'round trip test worked')
      }
      t.end()
    })
  })

  t.test('with a type-consistent array of primitive values', function (t) {
    var input = {irate: [0, 1, 2]}

    toTOMLString(input, function (er, output) {
      t.ifError(er, 'integer array successfully converted')

      if (!er) {
        t.equals(output, 'irate = [ 0, 1, 2 ]\n')
        t.same(toml.parse(output), input, 'round trip test worked')
      }
      t.end()
    })
  })

  t.test('with a type-inconsistent array of primitive values', function (t) {
    var input = {irksome: [0, false, 2]}

    toTOMLString(input, function (er, output) {
      t.equal(
        er && er.message,
        'for array with path irksome, expected number but got boolean',
        'got expected error message'
      )
      t.notOk(output, "shouldn't have gotten any output from the stream")

      t.end()
    })
  })

  t.end()
})
