const {isDate, isNumber, isObject, isString} = require('util')
const Promise = require('bluebird')
const Transform = require('stream').Transform

import toTOMLDate from './to-toml-date.js'
import toTOMLNumber from './to-toml-number.js'
import toTOMLString from './to-toml-string.js'

export default class TOMLStream extends Transform {
  constructor () {
    super({objectMode: true})
  }

  _transform (chunk, encoding, cb) {
    if (!isObject(chunk)) {
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
