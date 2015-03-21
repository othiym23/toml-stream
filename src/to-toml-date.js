export default function toTOMLDate (date) {
  // Is this always RFC3339-compliant? I DON'T KNOW
  return date.toISOString()
}
