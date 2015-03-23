const {isArray, isBoolean, isDate, isNumber, isObject, isString} = require('util')

export default class TOMLCodec {
  encode (key, value, writable, path) {
    const encodedKey = this._encodeKey(key)
    const encodedValue = this._encodeValue(value)
    return writable.push(encodedKey + ' = ' + encodedValue + '\n')
  }

  _encodeKey (key) {
    if (/^[A-Za-z0-9_-]+$/.test(key)) return key

    return JSON.stringify(key)
  }

  _encodeValue (value) {
    return JSON.stringify(value).slice(1, -1)
  }
}

export function getTypeTag (thing) {
  if (isString(thing)) {
    return 'string'
  } else if (isNumber(thing)) {
    return 'number'
  } else if (isDate(thing)) {
    return 'date'
  } else if (isBoolean(thing)) {
    return 'boolean'
  } else if (isArray(thing)) {
    return 'array'
  } else if (!isObject(thing)) {
    return typeof thing
  } else {
    return 'object'
  }
}

export function encode (key, value, writable, path = []) {
  const subject = value[key]
  const tag = getTypeTag(subject)
  const codec = getCodec(tag)

  if (!codec) {
    return writable.emit(
      'error',
      new Error('unexpected type for \'' + key + '\': \'' + tag + '\'')
    )
  }

  codec.encode(key, subject, writable, path.concat(key))
}

// FIXME: cyclic dependencies are hard, and Babel's transpiled ES6 modules
// aren't actually declarative
import ArrayTOMLCodec from './array.js'
import BooleanTOMLCodec from './boolean.js'
import CommentTOMLCodec from './comment.js'
import DateTOMLCodec from './date.js'
import NumberTOMLCodec from './number.js'
import ObjectTOMLCodec from './object.js'
import StringTOMLCodec from './string.js'

let codecs
export function getCodec (type) {
  if (!codecs) {
    codecs = {
      'array': new ArrayTOMLCodec(),
      'boolean': new BooleanTOMLCodec(),
      // a little special because getTypeTag does not recognize it
      'comment': new CommentTOMLCodec(),
      'date': new DateTOMLCodec(),
      'number': new NumberTOMLCodec(),
      'object': new ObjectTOMLCodec(),
      'string': new StringTOMLCodec()
    }
  }
  return codecs[type]
}
