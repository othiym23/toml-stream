export default function encodeKey (key) {
  if (/^[A-Za-z0-9_-]+$/.test(key)) return key

  return JSON.stringify(key)
}
