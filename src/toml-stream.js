const {isObject, isString} = require('util')
const concat = require('concat-stream')
const Transform = require('stream').Transform

import encode from './encode.js'
import toTOMLComment from './to-toml-comment.js'

export default class TOMLStream extends Transform {
  constructor () {
    super({objectMode: true})
    this.started = false
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

    // blank line separator between chunks
    if (this.started) this.push('\n')

    encode(chunk, this).then(() => cb()).catch(cb)
  }

  push (...args) {
    this.started = true
    super.push(...args)
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
