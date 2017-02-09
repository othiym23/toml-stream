import TOMLCodec from './toml.js'

export default class NumberTOMLCodec extends TOMLCodec {
  _encodeValue (number) {
    // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    var parts = number.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '_')
    return parts.join('.')
  }
}
