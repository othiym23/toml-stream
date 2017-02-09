import { Transform } from 'stream'

import concat from 'concat-stream'
import once from 'once'

import encode from './codecs/index.js'
import { getCodec, getTypeTag } from './codecs/get.js'

class TOMLStream extends Transform {
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

function toTOMLString (object, cb) {
  const stream = new TOMLStream()
  const onced = once(cb)
  stream.pipe(concat(output => onced(null, output)))
  stream.on('error', onced)

  stream.end(object)
}

// mixing syntaxes is bad, but default / single export is clunky in newer Babel
module.exports = TOMLStream
module.exports.toTOMLString = toTOMLString
