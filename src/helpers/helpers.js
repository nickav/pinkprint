const fs = require('fs');
const humps = require('humps');
const helperDate = require('helper-date');
const pluralize = require('pluralize');

// strings
exports.camelCase = humps.camelize;
exports.pascalCase = humps.pascalize;
exports.snakeCase = humps.decamelize;
exports.kebobCase = (str) => humps.decamelize(str, { separator: '-' });
exports.upperCase = (str) => (str || '').toUpperCase();
exports.lowerCase = (str) => (str || '').toLowerCase();
exports.pluralize = pluralize;

// dates
exports.sqlDate = () => new Date().toISOString().slice(0, 10);
exports.moment = helperDate;

// arrays
exports.join = (arr, delim = ', ') => (arr || []).join(delim);

// filesystem
exports.readFile = (filepath) => {
  let contents = '';
  try {
    contents = fs.readFileSync(filepath, 'utf8');
  } catch (e) {}
  return contents;
};
exports.readDir = (dir, filter) => {
  let files = [];
  try {
    files = fs.readdirSync(dir);
  } catch (e) {}
  return files;
};

// misc
exports.default = (val, defaultVal) => (val == null ? defaultVal : val);
