import TOMLCodec from './index.js'

export default class BooleanTOMLCodec extends TOMLCodec {
  _encodeValue (bool) {
    if (bool === true) return 'true'

    return 'false'
  }
}
