import moment from 'moment'

export default function toTOMLDate (date) {
  // Is this always RFC3339-compliant? I DON'T KNOW
  return moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
}
