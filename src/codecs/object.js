import encode from './index.js'
import TOMLCodec from './toml.js'
import { getTypeTag } from './get.js'

export default class ObjectTOMLCodec extends TOMLCodec {
  // override the standard behavior because of our need for state
  encode (key, value, writable, path = []) {
    const values = []
    const objects = []

    // non-object plain values need to go first
    Object.keys(value).forEach(key => {
      if (getTypeTag(value[key]) === 'object') {
        objects.push(key)
      } else {
        values.push(key)
      }
    })

    // only emit an ["object key"] if there are actual variables to capture
    if (values.length) {
      if (writable.started) writable.push('\n')

      let name = '[' + path.map(p => this._encodeKey(p)).join('.') + ']'
      // FIXME: this is probably going to break things; is a cheesy hack to
      // indicate tabular array elements
      if (!key) name = '[' + name + ']'
      writable.push(name + '\n')
    }

    values.forEach(k => encode(k, value, writable, path))
    objects.forEach(k => encode(k, value, writable, path))
  }
}
