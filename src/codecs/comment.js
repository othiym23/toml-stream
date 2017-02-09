import TOMLCodec from './toml.js'

export default class CommentTOMLCodec extends TOMLCodec {
  // overrides base class behavior, because there is no key
  encode (key, string, writable, path) {
    // FIXME: switch to for..of as soon as I have a decent ES6 coverage framework
    string.split(/[\n\r]+/).forEach(line => {
      const encoded = line
      writable.push('# ' + encoded + '\n')
    })
  }
}
