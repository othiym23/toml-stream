export default function toTOMLBoolean (bool) {
  if (bool === true) return 'true'
  else if (bool === false) return 'false'
  else throw new Error('incorrect type "' + typeof bool + '" of value "' + bool + '"')
}
