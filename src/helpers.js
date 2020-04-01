const { execSync } = require('child_process');
const fs = require('fs');

const { findNearestFileSync } = require('./file-utils');

/** Simple assert funciton. */
const assert = (exports.assert = (cond, error) => {
  if (cond) return;
  const message = typeof error === 'function' ? error(cond) : error;
  console.error(message);
  process.exit(1);
});

/** Get git user name and email. */
const getGitUser = (exports.getGitUser = () => {
  let name;
  let email;

  try {
    name = execSync('git config --get user.name');
    email = execSync('git config --get user.email');
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1);
  email = email && email.toString().trim();
  return { name: name || '', email: email || '' };
});

const getGitRoot = (exports.getGitRoot = () => {
  try {
    return execSync('git rev-parse --show-toplevel')
      .toString()
      .trim();
  } catch (e) {}
});

const catchAll = (exports.catchAll = (fn, defaultResult) => {
  let result = defaultResult;
  try {
    result = fn();
  } catch (e) {}
  return result;
});

const requireSafe = (exports.requireSafe = (file, defaultValue = {}) => {
  if (!fs.existsSync(file) && !fs.existsSync(file + '.js')) {
    return null;
  }

  try {
    return require(file);
  } catch (err) {
    return defaultValue;
  }
});

const FILENAME_RESERVED_REGEX = /[<>:"\/\\|?*\x00-\x1F]/g;
const FILENAME_RESERVED_REGEX_WIN32 = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

const isValidFileName = (exports.isValidFileName = (string) => {
  if (!string || string.length > 255) {
    return false;
  }

  if (
    FILENAME_RESERVED_REGEX.test(string) ||
    FILENAME_RESERVED_REGEX_WIN32.test(string)
  ) {
    return false;
  }

  if (/^\.\.?$/.test(string)) {
    return false;
  }

  return true;
});
