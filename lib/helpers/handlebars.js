const fs = require('fs')
const humps = require('humps')

// strings
exports.camelcase = humps.camelcase
exports.pascalcase = humps.pascalize
exports.snakecase = humps.decamelize
exports.kebobcase = str => humps.decamelize(str, { separator: '-' })
exports.uppercase = str => (str || '').toUpperCase()
exports.lowercase = str => (str || '').toLowerCase()
exports.default = (val, defaultVal) => (val == null ? defaultVal : val)

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
exports.readdir = (dir, filter) => fs.readdirSync(dir)
