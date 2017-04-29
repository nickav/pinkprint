const fs = require('fs')
const chalk = require('chalk')
const helpers = require('./helpers/handlebars')

module.exports = (root, verbose) => {
  let files = helpers.readdir(root).filter(file => !file.startsWith('.'))

  if (verbose) {
    console.log(chalk.cyan('Available blueprints:'))
    files.forEach(file => console.log(`- ${file}`))
  }

  return files
}
