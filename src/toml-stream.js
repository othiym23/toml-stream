const {isBoolean, isDate, isNumber, isObject, isString} = require('util')
const concat = require('concat-stream')
const Promise = require('bluebird')
const Transform = require('stream').Transform

import toTOMLBoolean from './to-toml-boolean.js'
import toTOMLComment from './to-toml-comment.js'
import toTOMLDate from './to-toml-date.js'
import toTOMLNumber from './to-toml-number.js'
import toTOMLString from './to-toml-string.js'

export default class TOMLStream extends Transform {
  constructor () {
    super({objectMode: true})
  }

  _transform (chunk, encoding, cb) {
    if (isString(chunk)) {
      toTOMLComment(chunk, this)
      return cb()
    } else if (!isObject(chunk) || Array.isArray(chunk)) {
      return cb(new Error(
        'unexpected type for chunk \'' + JSON.stringify(chunk) + '\''
      ))
    }

    Promise.map(Object.keys(chunk), key => {
      const value = chunk[key]
      let encoded
      if (isString(value)) {
        encoded = toTOMLString(value)
      } else if (isNumber(value)) {
        encoded = toTOMLNumber(value)
      } else if (isDate(value)) {
        encoded = toTOMLDate(value)
      } else if (isBoolean(value)) {
        encoded = toTOMLBoolean(value)
      } else {
        throw new Error(
          'unexpected type for key \'' + key + '\': \'' + JSON.stringify(value) + '\''
        )
      }

      this.push(key + ' = ' + encoded + '\n')
    })
    .then(() => cb())
    .catch(cb)
  }
}

TOMLStream.toTOMLString = (object, cb) => {
  var stream = new TOMLStream()
  stream.pipe(concat(function (output) {
    cb(null, output)
  }))
  stream.on('error', cb)

  stream.end(object)
}
