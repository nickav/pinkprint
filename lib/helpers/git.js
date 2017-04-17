const exec = require('child_process').execSync

/** Get git user name and email. */
exports.user = function () {
  var name
  var email

  try {
    name = exec('git config --get user.name')
    email = exec('git config --get user.email')
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && email.toString().trim()
  return { name: (name || ''), email: (email || '') }
}

/** Clone the git repo to url. */
exports.clone = function (url, dir='') {
  try {
    exec(`git clone ${url} ${dir}`)
  } catch (e) {
    return false
  }

  return true
}
