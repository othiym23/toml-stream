const {isArray, isBoolean, isDate, isNumber, isObject, isString} = require('util')

export default function typeTag (thing) {
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
