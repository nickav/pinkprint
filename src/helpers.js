import { execSync } from 'child_process';

import { findNearestFileSync } from './file-utils';

/** Simple assert funciton. */
export const assert = (cond, error) => {
  if (cond) return;
  console.error(error);
  process.exit(1);
};

export const findRoot = (filenames, error = true) => {
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
};

/** Get git user name and email. */
export const getGitUser = () => {
  let name;
  let email;

  try {
    name = execSync('git config --get user.name');
    email = execSync('git config --get user.email');
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1);
  email = email && email.toString().trim();
  return { name: name || '', email: email || '' };
};

export const getGitRoot = () => {
  try {
    return execSync('git rev-parse --show-toplevel')
      .toString()
      .trim();
  } catch (e) {}
};

export const findProjectRoot = () => {
  getGitRoot() || findRoot(['package.json']);
};
