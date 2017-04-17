const fs = require('fs')
const chalk = require('chalk')

module.exports = (root, blueprint) => {
  let files = fs.readdirSync(root)

  console.log(chalk.cyan('Available blueprints:'))
  files.filter(file => !file.startsWith('.')).forEach(file => {
    console.log(`- ${file}`)
  })
}
