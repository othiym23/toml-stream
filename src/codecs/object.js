import TOMLCodec from './index.js'
import { encode, getTypeTag } from './index.js'

export default class ObjectTOMLCodec extends TOMLCodec {
  // override the standard behavior because of our need for state
  encode (key, value, writable, path = []) {
    const { values, objects } = partition(value)

    if (values.length) {
      if (writable.started) writable.push('\n')

      let name = '[' + path.map(p => this._encodeKey(p)).join('.') + ']'
      if (!key) name = '[' + name + ']'
      writable.push(name + '\n')
    }

    values.forEach(k => encode(k, value, writable, path))
    objects.forEach(k => encode(k, value, writable, path))
  }
}

function partition (object) {
  const values = []
  const objects = []
  for (let key of Object.keys(object)) {
    if (getTypeTag(object[key]) === 'object') {
      objects.push(key)
    } else {
      values.push(key)
    }
  }

  return { values, objects }
}
