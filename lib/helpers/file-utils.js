const fs = require('fs')
const path = require('path')

const getParentDirectory = (file) => {
  if (!file || file === '/') {
    return false
  }
  return path.resolve(file, '..')
}

// TODO: update this definition to match findNearestFileSync
const findNearestFile = (name, file, cb) => {
  const parentDir = getParentDirectory(file)
  if (!parentDir) {
    return cb(null, false)
  }

  const newFile = path.join(parentDir, name)
  fs.stat(newFile, function(err, stats) {
    if (err && err.code === 'ENOENT') {
      return findNearestFile(name, parentDir, cb)
    }
    return cb(null, newFile)
  })
}

const findNearestFileSync = (dir, name) => {
  const newFile = path.join(dir, name)
  const exists = fs.existsSync(newFile)
  if (exists) {
    return dir
  }

  const parentDir = getParentDirectory(dir)
  return parentDir && findNearestFileSync(name, parentDir)
}

module.exports = {
  getParentDirectory,
  findNearestFile,
  findNearestFileSync
}
