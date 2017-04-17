const exec = require('child_process').execSync

module.exports = function (url, dir='') {
  try {
    exec(`git clone ${url} ${dir}`)
  } catch (e) {
    return false
  }

  return true
}
