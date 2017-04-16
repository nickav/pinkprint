/** General-purpose helper functions. */

/** Converts a string like 'foo bar' to 'foo-bar'. */
exports.slugify = function(str) {
  return str.toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/** Converts a string like 'FooBar' to 'foo-bar'. */
exports.toKebob = function(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/** Converts a string like 'foo-bar' to 'FooBar'. */
exports.toCamel = function(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}
