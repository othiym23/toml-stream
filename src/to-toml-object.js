const Promise = require('bluebird')

import encode from './encode.js'
import typeTag from './type-tag.js'

export default function toTOMLObject (value, writable, path = [], element = false) {
  const { values, objects } = partition(value)

  let name = '[' + path.join('.') + ']'

  return Promise.resolve(name)
                .then(n => {
                  if (values.length) {
                    if (writable.started) writable.push('\n')
                    if (element) name = '[' + name + ']'
                    writable.push(name + '\n')
                  }
                })
                .then(() => run(values))
                .then(() => run(objects))

  function run (array) {
    return Promise.each(
      array,
      k => encode({[k]: value[k]}, writable, path)
    )
  }
}

function partition (object) {
  const values = []
  const objects = []
  for (let key of Object.keys(object)) {
    if (typeTag(object[key]) === 'object') {
      objects.push(key)
    } else {
      values.push(key)
    }
  }

  return { values, objects }
}
