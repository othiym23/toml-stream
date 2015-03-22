const Promise = require('bluebird')

import toTOMLBoolean from './to-toml-boolean.js'
import toTOMLComment from './to-toml-comment.js'
import toTOMLDate from './to-toml-date.js'
import toTOMLNumber from './to-toml-number.js'
import toTOMLObject from './to-toml-object.js'
import toTOMLString from './to-toml-string.js'
import typeTag from './type-tag.js'

export default function toTOMLArray (key, array, writable, path = '.') {
  var types = typeCheck(array)

  if (types.length > 1) {
    throw new Error(
      'for array with path ' + path +
        ', expected ' + types[0] +
        ' but got ' + types[1]
    )
  }

  if (types[0] === 'object') {
    return Promise.each(
      array,
      object => toTOMLObject(object, writable, path, true)
    )
  } else {
    writable.push(key + ' = ')
    helper(array, 0, [])
  }

  function helper (array, index, parent, prefix = '') {
    var types = typeCheck(array)
    if (types.length > 1) {
      throw new Error(
        'for array with path ' + path +
        ', expected ' + types[0] + ' but got ' + types[1]
      )
    }

    if (types[0] === 'array') {
      writable.push(prefix + '[\n')
      array.forEach((a, i, p) => helper(a, i, p, prefix + '  '))
      writable.push(prefix + ']')
    } else {
      writable.push(
        prefix + '[ ' + array.map(e => encodeSimple(e)).join(', ') + ' ]'
      )
    }

    if (index < (parent.length - 1)) writable.push(',')
    writable.push('\n')
  }
}

function typeCheck (array) {
  return Object.keys(array.reduce((accumulator, thing) => {
    accumulator[typeTag(thing)] = thing
    return accumulator
  }, {}))
}

function encodeSimple (value) {
  switch (typeTag(value)) {
    case 'string':
      return toTOMLString(value)
    case 'number':
      return toTOMLNumber(value)
    case 'date':
      return toTOMLDate(value)
    case 'boolean':
      return toTOMLBoolean(value)
    default:
      throw new Error(
        'unexpected type: \'' + typeTag(value) + '\''
      )
  }
}
