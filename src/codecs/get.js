import { isArray, isBoolean, isDate, isNumber, isObject, isString } from 'util'

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
