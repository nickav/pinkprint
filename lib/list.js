const fs = require('fs')
const chalk = require('chalk')
const findRoot = require('./helpers/find-root')

module.exports = (templateFolder, blueprint) => {
  let root = findRoot(templateFolder)
  let files = fs.readdirSync(root)

  console.log(chalk.cyan('Available blueprints:'))
  files.filter(file => !file.startsWith('.')).forEach(file => {
    console.log(`- ${file}`)
  })
}
