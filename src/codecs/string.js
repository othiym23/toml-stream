import TOMLCodec from './index.js'

export default class StringTOMLCodec extends TOMLCodec {
  _encodeValue (string) {
    var lines = string.split('\n')
    if (lines.length < 2) {
      return JSON.stringify(string)
    } else {
      // multi-line strings are much easier to read
      return '"""\n' +
        lines.map(l => JSON.stringify(l)
                           .slice(1, -1)
                           .replace(/\\"/g, '"'))
             .join('\n')
             .replace(/"""/g, '""\\"') +
        '"""'
    }
  }
}
