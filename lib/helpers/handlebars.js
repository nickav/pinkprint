const humps = require('humps')

// string code transforms
exports.camelcase = humps.camelcase
exports.pascalcase = humps.pascalize
exports.snakecase = humps.decamelize
exports.kebobcase = str => humps.decamelize(str, { separator: '-' })

// array helpers
exports.join = (arr, delim = ', ') => (arr || []).join(delim)
