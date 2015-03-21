var concat = require('concat-stream')
var test = require('tap').test
var toml = require('toml')
var TOMLStream = require('../')

test('adding comments to TOML', function (t) {
  t.test('basic comment', function (t) {
    var input = 'I am a comment now'

    var stream = new TOMLStream()
    stream.on('error', function (er) {
      t.ifError(er, 'should have parsed correctly')
      t.end()
    })

    stream.pipe(concat(function (output) {
      t.equal(output, '# I am a comment now\n', 'got expected output')
      t.same(toml.parse(output), {}, 'round-tripped OK (comment stripped)')
      t.end()
    }))

    stream.end(input)
  })

  t.test('a comment in need of escaping', function (t) {
    var input = 'I am a comment\n' +
                'with many different lines\n' +
                'like moonlight through blinds'

    var stream = new TOMLStream()
    stream.on('error', function (er) {
      t.ifError(er, 'should have parsed correctly')
      t.end()
    })

    stream.pipe(concat(function (output) {
      t.equal(
        output,
        '# I am a comment\n' +
        '# with many different lines\n' +
        '# like moonlight through blinds\n',
        'got expected output'
      )
      t.same(toml.parse(output), {}, 'round-tripped OK (comment stripped)')
      t.end()
    }))

    stream.end(input)
  })

  t.end()
})
