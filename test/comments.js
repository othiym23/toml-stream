var test = require('tap').test
var toml = require('toml')
var toTOMLString = require('../').toTOMLString
var toTOMLComment = require('../lib/to-toml-comment.js')

test('adding comments to TOML', function (t) {
  t.test('trying to comment without a writable', function (t) {
    t.throws(function () {
      toTOMLComment('hello', null)
    }, 'failed as expected')

    t.end()
  })

  t.test('basic comment', function (t) {
    var input = 'I am a comment now'

    toTOMLString(input, function (er, output) {
      t.ifError(er, 'should have parsed correctly')

      t.equal(output, '# I am a comment now\n', 'got expected output')
      t.same(toml.parse(output), {}, 'round-tripped OK (comment stripped)')
      t.end()
    })
  })

  t.test('a comment in need of escaping', function (t) {
    var input = 'I am a comment\n' +
                'with many different lines\n' +
                'like moonlight through blinds'

    toTOMLString(input, function (er, output) {
      t.ifError(er, 'should have parsed correctly')

      t.equal(
        output,
        '# I am a comment\n' +
        '# with many different lines\n' +
        '# like moonlight through blinds\n',
        'got expected output'
      )
      t.same(toml.parse(output), {}, 'round-tripped OK (comment stripped)')
      t.end()
    })
  })

  t.end()
})
