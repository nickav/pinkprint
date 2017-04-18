const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const generate = require('./generate')

module.exports = (root, blueprint) => {
  if (!root) {
    console.log('No blueprint folder found. Creating blueprint folder...')
    // TODO: search for '.git' folder and fallback to cwd
    root = process.cwd()
    fs.mkdirSync(`${root}/blueprints`)
  }

  if (fs.existsSync(path.join(root, blueprint))) {
    console.log(`Error! Blueprint '${blueprint}' already exists in ${root}`)
    process.exit(1)
  }

  let src = path.join(__dirname, 'blueprints')
  return generate(src, root, 'blueprint', blueprint)
}
