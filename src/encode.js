const Promise = require('bluebird')

import encodeKey from './encode-key.js'
import toTOMLArray from './to-toml-array.js'
import toTOMLBoolean from './to-toml-boolean.js'
import toTOMLDate from './to-toml-date.js'
import toTOMLNumber from './to-toml-number.js'
import toTOMLObject from './to-toml-object.js'
import toTOMLString from './to-toml-string.js'
import typeTag from './type-tag.js'

export default function encode (chunk, writable, path = []) {
  return Promise.each(Object.keys(chunk), key => {
    const value = chunk[key]
    const safeKey = encodeKey(key)
    const deeper = path.concat(safeKey)

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
      case 'array':
        return toTOMLArray(safeKey, value, writable, deeper)
      case 'object':
        return toTOMLObject(value, writable, deeper)
      default:
        throw new Error(
          'unexpected type for \'' + deeper + '\': \'' + typeTag(value) + '\''
        )
    }

    writable.push(safeKey + ' = ' + encoded + '\n')
  })
}
