import toTOMLBoolean from './to-toml-boolean.js'
import toTOMLComment from './to-toml-comment.js'
import toTOMLDate from './to-toml-date.js'
import toTOMLNumber from './to-toml-number.js'
import toTOMLString from './to-toml-string.js'
import typeTag from './type-tag.js'

export default function toTOMLArray (array, path = '.') {
  let output = '[ '
  var types = Object.keys(array.reduce(
    (accumulator, thing) => {
      const tag = typeTag(thing)
      accumulator[tag] = thing
      return accumulator
    },
    {}
  ))

  if (types.length > 1) {
    throw new Error(
      'for array with path ' + path +
        ', expected ' + types[0] +
        ' but got ' + types[1]
    )
  }

  output += array.map(thing => encodeSimple(thing)).join(', ')

  return output + ' ]'
}

function encodeSimple (value) {
  switch (typeTag(value)) {
    case 'string':
      return toTOMLString(value)
    case 'number':
      return toTOMLNumber(value)
    case 'date':
      return toTOMLDate(value)
    case 'boolean':
      return toTOMLBoolean(value)
    default:
      throw new Error(
        'unexpected type: \'' + typeTag(value) + '\''
      )
  }
}
