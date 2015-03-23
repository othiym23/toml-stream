import TOMLCodec from './index.js'

export default class DateTOMLCodec extends TOMLCodec {
  _encodeValue (date) {
    // Is this always RFC3339-compliant? I DON'T KNOW
    return date.toISOString()
  }
}
