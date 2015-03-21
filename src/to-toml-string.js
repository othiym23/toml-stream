export default function toTOMLString (string) {
  var lines = string.split('\n')
  if (lines.length < 2) {
    return JSON.stringify(string)
  } else {
    return '"""\n' +
      lines.map(l => JSON.stringify(l)
                         .slice(1, -1)
                         .replace(/\\"/g, '"'))
           .join('\n')
           .replace(/"""/g, '"\\""') +
      '"""'
  }
}
