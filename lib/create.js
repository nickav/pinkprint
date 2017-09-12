const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const assert = require('./helpers/assert')
const generate = require('./generate')
const git = require('./helpers/git')

module.exports = (root, name, files) => {
  if (!root) {
    console.log('No pinkprint folder found. Creating pinkprint folder...')
    root = git.root() || process.cwd()
    root += '/pinkprints'
    fs.mkdirSync(root)
  }

  assert(
    !fs.existsSync(path.join(root, name)),
    `Error! Pinkprint '${name}' already exists in ${root}`
  )

  let src = path.join(__dirname, 'pinkprints', 'pinkprint')
  generate(src, root, name)
}
