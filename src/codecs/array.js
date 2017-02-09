import TOMLCodec from './toml.js'
import { getCodec, getTypeTag } from './get.js'

export default class ArrayTOMLCodec extends TOMLCodec {
  // override the standard behavior because of our need for state
  encode (key, array, writable, path = '.') {
    const types = typeCheck(array)
    if (types.length > 1) {
      return writable.emit(
        'error',
        new Error(
        'for array with path ' + path +
          ', expected ' + types[0] + ' but got ' + types[1]
        )
      )
    }

    if (types[0] === 'object') {
      array.forEach(object => getCodec('object').encode(null, object, writable, path))
      return
    } else {
      writable.push(this._encodeKey(key) + ' = ')
      helper(array, 0, [])
    }

    function helper (array, index, parent, prefix = '') {
      const types = typeCheck(array)
      if (types.length > 1) {
        return writable.emit(
          'error',
          new Error(
          'for array with path ' + path +
            ', expected ' + types[0] + ' but got ' + types[1]
          )
        )
      }

      if (types[0] === 'array') {
        writable.push(prefix + '[\n')
        array.forEach((a, i, p) => helper(a, i, p, prefix + '  '))
        writable.push(prefix + ']')
      } else {
        writable.push(
          prefix + '[ ' + array.map(e => encodeSimple(e, writable)).join(', ') + ' ]'
        )
      }

      if (index < (parent.length - 1)) writable.push(',')
      writable.push('\n')
    }
  }
}

function typeCheck (array) {
  return Object.keys(array.reduce((accumulator, thing) => {
    accumulator[getTypeTag(thing)] = thing
    return accumulator
  }, {}))
}

function encodeSimple (value, writable) {
  const tag = getTypeTag(value)
  const codec = getCodec(tag)
  if (codec) return codec._encodeValue(value)

  writable.emit('error', new Error('unexpected type: \'' + tag + '\''))
}
