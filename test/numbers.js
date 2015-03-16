var concat = require('concat-stream')
var test = require('tap').test
var toml = require('toml')
var TOMLStream = require('../')

test('numeric TOML values', function (t) {
  t.test('with one value', function (t) {
    var input = {number: 314}

    var stream = new TOMLStream()
    stream.pipe(concat(function (output) {
      t.equals(output, 'number = 314\n', 'got expected output')
      t.same(toml.parse(output), input, 'round trip test worked')
      t.end()
    }))
    stream.on('error', function (er) {
      t.ifError(er, "shouldn't have failed to write a stream this simple")
    })

    stream.end(input)
  })

  t.test('with threeve values', function (t) {
    var input = {number1: 314, number2: 415, number3: 303, number4: 808}

    var stream = new TOMLStream()
    stream.pipe(concat(function (output) {
      t.equals(
        output,
        'number1 = 314\nnumber2 = 415\nnumber3 = 303\nnumber4 = 808\n',
        'got expected output'
      )
      t.same(toml.parse(output), input, 'round trip test worked')
      t.end()
    }))
    stream.on('error', function (er) {
      t.ifError(er, "shouldn't have failed to write a stream this simple")
    })

    stream.end({number1: 314, number2: 415, number3: 303, number4: 808})
  })

  t.end()
})
