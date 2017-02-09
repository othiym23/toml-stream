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

  // _encodeValue must be implemented by subclasses
  _encodeValue (value) {
    throw new Error(
      'nothing done with ' + value +
      ' because _encodeValue must be implemented in subclasses'
    )
  }
}
