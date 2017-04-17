const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const generate = require('./generate')

module.exports = (root, blueprint) => {
  if (!root) {
    console.log('No blueprint folder found. Creating blueprint folder...') 
    // TODO: search for '.git' folder and fallback to cwd
    let cwd = process.cwd()
    fs.mkdirSync(`${cwd}/blueprints`)
  }

  let blueprintDest = path.join(root, blueprint)
  if (fs.existsSync(blueprintDest)) {
    console.log(chalk.red(`Error! Blueprint '${blueprint}' already exists in:`))
    console.log(blueprintDest)
    process.exit(1)
  }

  console.log('create:')

  let src = path.join(__dirname, 'blueprints')
  console.log('  src', src)
  console.log('  root', root)
  return generate(src, root, 'blueprint', blueprint)
}
