const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const assert = require('./helpers/assert')
const generate = require('./generate')
const git = require('./helpers/git')

module.exports = (root, name, files) => {
  if (!root) {
    console.log('No blueprint folder found. Creating blueprint folder...')
    root = git.root() || process.cwd()
    root += '/blueprints'
    fs.mkdirSync(root)
  }

  assert(
    !fs.existsSync(path.join(root, name)),
    `Error! Blueprint '${name}' already exists in ${root}`
  )

  let src = path.join(__dirname, 'blueprints', 'blueprint')
  generate(src, root, name)
}
