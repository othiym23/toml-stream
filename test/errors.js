var concat = require('concat-stream')
var test = require('tap').test
var TOMLStream = require('../')

test('confusing streaming TOML', function (t) {
  t.test('number at the chunk level', function (t) {
    var stream = new TOMLStream()
    stream.on('error', function (er) {
      t.equal(
        er.message,
        'unexpected type for chunk \'4\'',
        'failed in the expected way'
      )
      t.end()
    })

    stream.pipe(concat(function (output) {
      t.equal(output, undefined, "shouldn't have gotten any output")
      t.end()
    }))

    stream.end(4)
  })

  t.test('number passed to toTOMLString', function (t) {
    TOMLStream.toTOMLString(4, function (er, output) {
      t.ok(er, 'got error, as expected')
      t.notOk(output, "didn't receive any output")

      t.end()
    })
  })

  t.test('array at the chunk level', function (t) {
    var stream = new TOMLStream()
    stream.on('error', function (er) {
      t.equal(
        er.message,
        'unexpected type for chunk \'[]\'',
        'failed in the expected way'
      )
      t.end()
    })

    stream.pipe(concat(function (output) {
      t.equal(output, undefined, "shouldn't have gotten any output")
      t.end()
    }))

    stream.end([])
  })

  t.test('array passed to toTOMLString', function (t) {
    TOMLStream.toTOMLString([], function (er, output) {
      t.ok(er, 'got error, as expected')
      t.notOk(output, "didn't receive any output")

      t.end()
    })
  })

  t.test('at the value level', function (t) {
    var stream = new TOMLStream()
    stream.on('error', function (er) {
      t.equal(
        er.message,
        'unexpected type for \'number\': \'undefined\'',
        'failed on ham, so sad'
      )
      t.end()
    })

    stream.pipe(concat(function (output) {
      t.notOk(output, "shouldn't have gotten any output")
      t.end()
    }))

    stream.end({number: undefined})
  })

  t.test('bad object passed to toTOMLString', function (t) {
    TOMLStream.toTOMLString({number: undefined}, function (er, output) {
      t.ok(er, 'got error, as expected')
      t.notOk(output, "didn't receive any output")

      t.end()
    })
  })

  t.end()
})
