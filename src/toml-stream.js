const {isDate, isNumber, isObject} = require('util')
const Promise = require('bluebird')
const Transform = require('stream').Transform

import toTOMLNumber from './to-toml-number.js'
import toTOMLDate from './to-toml-date.js'

// let's see how ES6 classes deal with Node base classes
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
      if (isNumber(value)) {
        this.push(key + ' = ' + toTOMLNumber(value) + '\n')
      } else if (isDate(value)) {
        this.push(key + ' = ' + toTOMLDate(value) + '\n')
      } else {
        throw new Error(
          'unexpected type for key \'' + key + '\': \'' + JSON.stringify(value) + '\''
        )
      }
    })
    .then(() => cb())
    .catch(cb)
  }
}
