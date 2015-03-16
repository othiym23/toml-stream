var concat = require('concat-stream')
var test = require('tap').test
var JSONStream = require('JSONStream')

test('emitting streaming JSON', function (t) {
  var stream = JSONStream.stringify()
  stream.pipe(concat(function (output) {
    t.equals(output, '[\n{"number":314}\n]\n', 'got expected output')
    t.end()
  }))
  stream.on('error', function (er) {
    t.ifError(er, "shouldn't have failed to write a stream this simple")
  })

  stream.end({number: 314})
})
