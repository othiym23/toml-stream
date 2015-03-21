var concat = require('concat-stream')
var test = require('tap').test
var toml = require('toml')
var TOMLStream = require('../')

test('date TOML values', function (t) {
  t.test('with one value', function (t) {
    var date = new Date('2017-08-10T08:34:12.666Z')
    var input = {date: date}

    var stream = new TOMLStream()
    stream.pipe(concat(function (output) {
      t.equals(output, 'date = 2017-08-10T08:34:12.666Z\n')
      t.same(toml.parse(output), input, 'round trip test worked')
      t.end()
    }))
    stream.on('error', function (er) {
      t.ifError(er, "shouldn't have failed to write a stream this simple")
      t.end()
    })

    stream.end(input)
  })

  t.end()
})
