var concat = require('concat-stream')
var test = require('tap').test
var TOMLStream = require('../')

test('confusing streaming TOML', function (t) {
  t.test('at the chunk level', function (t) {
    var stream = new TOMLStream()
    stream.on('error', function (er) {
      t.equal(
        er.message,
        'unexpected type for chunk \'"eventually I will be a comment"\'',
        'failed in the expected way'
      )
      t.end()
    })

    stream.pipe(concat(function (output) {
      t.notOk(output, "shouldn't have gotten any output")
      t.end()
    }))

    stream.end('eventually I will be a comment')
  })

  t.test('at the value level', function (t) {
    var stream = new TOMLStream()
    stream.on('error', function (er) {
      t.equal(
        er.message,
        'unexpected type for key \'number\': \'undefined\'',
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

  t.end()
})
