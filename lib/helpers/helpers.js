const fs = require('fs')
const humps = require('humps')
const helperDate = require('helper-date')
const pluralize = require('pluralize')

// strings
exports.camelcase = humps.camelize
exports.pascalcase = humps.pascalize
exports.snakecase = humps.decamelize
exports.kebobcase = str => humps.decamelize(str, { separator: '-' })
exports.uppercase = str => (str || '').toUpperCase()
exports.lowercase = str => (str || '').toLowerCase()
exports.pluralize = pluralize

// dates
exports.sqldate = _ => new Date().toISOString().slice(0, 10)
exports.moment = helperDate

// arrays
exports.join = (arr, delim = ', ') => (arr || []).join(delim)

// filesystem
exports.readfile = filepath => {
  let contents = ''
  try {
    contents = fs.readFileSync(filepath, 'utf8')
  } catch (e) { }
  return contents
}
exports.readdir = (dir, filter) => {
  let files = []
  try {
    files = fs.readdirSync(dir)
  } catch (e) { }
  return files
}

// misc
exports.default = (val, defaultVal) => (val == null ? defaultVal : val)
