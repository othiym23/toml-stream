export default function toTOMLComment (string, writable) {
  for (let line of string.split('\n')) {
    const encoded = JSON.stringify(line).slice(1, -1)
    writable.push('# ' + encoded + '\n')
  }
}
