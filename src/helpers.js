const { execSync } = require('child_process');

const { findNearestFileSync } = require('./file-utils');

/** Simple assert funciton. */
const assert = (exports.assert = (cond, error) => {
  if (cond) return;
  const message = typeof error === 'function' ? error(cond) : error;
  console.error(message);
  process.exit(1);
});

const findRoot = (exports.findRoot = (filenames, error = true) => {
  let cwd = process.cwd();
  let root;

  for (let i in filenames) {
    let filename = filenames[i];
    root = findNearestFileSync(filename, cwd);
    if (root) break;
  }

  if (!root && error) {
    console.log(`Error! Could not find '${filenames[0]}' directory in:`);
    console.log(utils.parents(cwd));
    process.exit(1);
  }

  return root;
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

const findProjectRoot = (exports.findProjectRoot = () => {
  getGitRoot() || findRoot(['package.json']);
});
