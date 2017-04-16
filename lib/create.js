const mkdirp = require('mkdirp')
const chalk = require('chalk')

module.exports = (dir, template) => {
  const path = `${dir}/${template}`
  mkdirp(path)
  console.log(chalk.green('Created', path))
}
