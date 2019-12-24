const humps = require('humps');
const helperDate = require('helper-date');
const pluralize = require('pluralize');

// strings
exports.camel = humps.camelize;
exports.pascal = humps.pascalize;
exports.snake = humps.decamelize;
exports.kebob = (str) => humps.decamelize(str, { separator: '-' });

exports.plural = pluralize;

exports.upper = (str) => (str || '').toUpperCase();
exports.lower = (str) => (str || '').toLowerCase();
exports.prefix = (str, prefixStr) =>
  typeof str === 'string' && str.length ? prefixStr + str : '';

// dates
exports.sqldate = (_) => new Date().toISOString().slice(0, 10);
exports.moment = helperDate;

// arrays
exports.join = (arr, delim = ', ') => (arr || []).join(delim);

// misc
exports.default = (val, defaultVal) => (val == null ? defaultVal : val);
