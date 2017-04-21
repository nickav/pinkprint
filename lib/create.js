const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const assert = require('./helpers/assert')
const generate = require('./generate')

module.exports = (root, name, files) => {
  if (!root) {
    console.log('No blueprint folder found. Creating blueprint folder...')
    // TODO: search for '.git' folder and fallback to cwd
    root = process.cwd()
    fs.mkdirSync(`${root}/blueprints`)
  }

  assert(
    !fs.existsSync(path.join(root, name)),
    `Error! Blueprint '${name}' already exists in ${root}`
  )

  let src = path.join(__dirname, 'blueprints', 'blueprint')
  console.log(src, '\n', root, '\n', name)
  generate(src, root, name)
}
