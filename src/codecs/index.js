import { getCodec, getTypeTag } from './get.js'

export default function encode (key, value, writable, path = []) {
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
