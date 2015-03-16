var concat = require('concat-stream')
var test = require('tap').test
var toml = require('toml')
var JSONStream = require('JSONStream')
var TOMLStream = require('../')

test('emitting streaming JSON', function (t) {
  var input = {
    name: 'sample',
    values: [
      {number1: 314},
      {number2: 271}
    ]
  }
  var stream = JSONStream.parse('values.*')

  stream.pipe(new TOMLStream())
        .pipe(concat(function (output) {
          t.equals(output, 'number1 = 314\nnumber2 = 271\n')
          t.same(toml.parse(output), {number1: 314, number2: 271}, 'roundtrip succeeded')
          t.end()
        }))
        .on('error', function (er) {
          t.ifError(er, "shouldn't have failed to transform a simple stream")
          t.fail("couldn't transform simple stream")
          t.end()
        })

  stream.end(JSON.stringify(input))
})
