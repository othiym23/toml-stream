const concat = require('concat-stream')
const once = require('once')
const Transform = require('stream').Transform

import { encode, getTypeTag, getCodec } from './codecs/index.js'

export default class TOMLStream extends Transform {
  constructor () {
    super({objectMode: true})
    this.started = false
  }

  _transform (chunk, encoding, cb) {
    const tag = getTypeTag(chunk)
    if (tag === 'string') {
      getCodec('comment').encode(null, chunk, this)
      return cb()
    } else if (tag !== 'object') {
      return cb(new Error(
        'unexpected type for chunk \'' + JSON.stringify(chunk) + '\''
      ))
    }

    // blank line separator between chunks
    if (this.started) this.push('\n')

    Object.keys(chunk).forEach(key => encode(key, chunk, this))

    cb()
  }

  push (...args) {
    this.started = true
    super.push(...args)
  }
}

TOMLStream.toTOMLString = (object, cb) => {
  const stream = new TOMLStream()
  const onced = once(cb)
  stream.pipe(concat(output => onced(null, output)))
  stream.on('error', onced)

  stream.end(object)
}
