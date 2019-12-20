const fs = require('fs');
const path = require('path');

/** Given a file, returns its parent path or false. */
const getParentDirectory = (file) => {
  if (!file || file === '/') {
    return false;
  }
  return path.resolve(file, '..');
};

// TODO: update this definition to match findNearestFileSync
const findNearestFile = (name, file, cb) => {
  const parentDir = getParentDirectory(file);
  if (!parentDir) {
    return cb(null, false);
  }

  const newFile = path.join(parentDir, name);
  fs.stat(newFile, function(err, stats) {
    if (err && err.code === 'ENOENT') {
      return findNearestFile(name, parentDir, cb);
    }
    return cb(null, newFile);
  });
};

/** Finds the closest directory that includes the file with name. */
const findNearestFileSync = (name, dir) => {
  const newFile = path.join(dir, name);
  const exists = fs.existsSync(newFile);
  if (exists) {
    return newFile;
  }

  const parentDir = getParentDirectory(dir);
  return parentDir && findNearestFileSync(name, parentDir);
};

/** Returns an array of parent directories (including dir). */
const parents = (dir) => {
  let result = [];
  do {
    result.push(dir);
  } while ((dir = getParentDirectory(dir)));
  return result;
};

module.exports = {
  findNearestFile,
  findNearestFileSync,
  getParentDirectory,
  parents,
};
