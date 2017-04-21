const fs = require('fs')
const humps = require('humps')
const helperDate = require('helper-date')

// strings
exports.camelcase = humps.camelcase
exports.pascalcase = humps.pascalize
exports.snakecase = humps.decamelize
exports.kebobcase = str => humps.decamelize(str, { separator: '-' })
exports.uppercase = str => (str || '').toUpperCase()
exports.lowercase = str => (str || '').toLowerCase()

// dates
exports.sqldate = _ => new Date().toISOString().slice(0, 10)
exports.moment = helperDate

// arrays
exports.join = (arr, delim = ', ') => (arr || []).join(delim)
exports.names = array =>
  (typeof array === 'string' ? [array] : array).map(qualified =>
    qualified.split(':').shift()
  )

exports.types = array =>
  (typeof array === 'string' ? [array] : array).map(qualified =>
    qualified.split(':').pop()
  )

// filesystem
exports.read = filepath => fs.readFileSync(filepath, 'utf8')
exports.readdir = (dir, filter) => {
  try {
    return fs.readdirSync(dir)
  } catch(e) {}
  return []
}

// misc
exports.default = (val, defaultVal) => (val == null ? defaultVal : val)
