var concat = require('concat-stream')
var test = require('tap').test
var toml = require('toml')
var TOMLStream = require('../')

test('integer TOML values', function (t) {
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

    stream.end(input)
  })

  t.end()
})

test('long integer TOML values', function (t) {
  t.test('with one value', function (t) {
    var input = {number: 3140}

    var stream = new TOMLStream()
    stream.pipe(concat(function (output) {
      t.equals(output, 'number = 3_140\n', 'got expected output')
      t.same(toml.parse(output), input, 'round trip test worked')
      t.end()
    }))
    stream.on('error', function (er) {
      t.ifError(er, "shouldn't have failed to write a stream this simple")
    })

    stream.end(input)
  })

  t.test('with threeve values', function (t) {
    var input = {number1: 3140, number2: 41500, number3: 303000, number4: 8080000}

    var stream = new TOMLStream()
    stream.pipe(concat(function (output) {
      t.equals(
        output,
        'number1 = 3_140\nnumber2 = 41_500\nnumber3 = 303_000\nnumber4 = 8_080_000\n',
        'got expected output'
      )
      t.same(toml.parse(output), input, 'round trip test worked')
      t.end()
    }))
    stream.on('error', function (er) {
      t.ifError(er, "shouldn't have failed to write a stream this simple")
    })

    stream.end(input)
  })

  t.end()
})

test('floating-point TOML values', function (t) {
  t.test('with one value', function (t) {
    var input = {number: 3.14}

    var stream = new TOMLStream()
    stream.pipe(concat(function (output) {
      t.equals(output, 'number = 3.14\n', 'got expected output')
      t.same(toml.parse(output), input, 'round trip test worked')
      t.end()
    }))
    stream.on('error', function (er) {
      t.ifError(er, "shouldn't have failed to write a stream this simple")
    })

    stream.end(input)
  })

  t.test('with threeve values', function (t) {
    var input = {number1: 3.14, number2: 4.15, number3: 30.3, number4: 0.808}

    var stream = new TOMLStream()
    stream.pipe(concat(function (output) {
      t.equals(
        output,
        'number1 = 3.14\nnumber2 = 4.15\nnumber3 = 30.3\nnumber4 = 0.808\n',
        'got expected output'
      )
      t.same(toml.parse(output), input, 'round trip test worked')
      t.end()
    }))
    stream.on('error', function (er) {
      t.ifError(er, "shouldn't have failed to write a stream this simple")
    })

    stream.end(input)
  })

  t.end()
})
