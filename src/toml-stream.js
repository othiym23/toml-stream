const {isObject, isString} = require('util')
const concat = require('concat-stream')
const Promise = require('bluebird')
const Transform = require('stream').Transform

import toTOMLBoolean from './to-toml-boolean.js'
import toTOMLComment from './to-toml-comment.js'
import toTOMLDate from './to-toml-date.js'
import toTOMLNumber from './to-toml-number.js'
import toTOMLString from './to-toml-string.js'
import typeTag from './type-tag.js'

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

function encode (chunk, writable, path = []) {
  return Promise.map(Object.keys(chunk), key => {
    const value = chunk[key]
    let encoded
    switch (typeTag(value)) {
      case 'string':
        encoded = toTOMLString(value)
        break
      case 'number':
        encoded = toTOMLNumber(value)
        break
      case 'date':
        encoded = toTOMLDate(value)
        break
      case 'boolean':
        encoded = toTOMLBoolean(value)
        break
      case 'object':
        const deeper = path.concat(key)
        const { values, objects } = partition(value)

        if (values.length) {
          if (writable.started) writable.push('\n')
          writable.push('[' + deeper.join('.') + ']\n')
        }
        return Promise.each(
          values,
          k => encode({[k]: value[k]}, writable, deeper),
          {concurrency: 1}
        ).then(() => Promise.each(
          objects,
          k => {
            return encode({[k]: value[k]}, writable, deeper)
          },
          {concurrency: 1}
        ))
      default:
        throw new Error(
          'unexpected type for key \'' + key + '\': \'' + JSON.stringify(value) + '\''
        )
    }

    writable.push(key + ' = ' + encoded + '\n')
  })
}

function partition (object) {
  const values = []
  const objects = []
  for (let key of Object.keys(object)) {
    if (typeTag(object[key]) === 'object') {
      objects.push(key)
    } else {
      values.push(key)
    }
  }

  return { values, objects }
}
