const {isObject, isNumber} = require('util')
const Promise = require('bluebird')
const Transform = require('stream').Transform

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
      if (!isNumber(value)) {
        throw new Error(
          'unexpected type for key \'' + key + '\': \'' + JSON.stringify(value) + '\''
        )
      }

      // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
      var parts = value.toString().split(".")
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '_')
      var delimited = parts.join('.')
      this.push(key + ' = ' + delimited + '\n')
    })
    .then(() => cb())
    .catch(cb)
  }
}
