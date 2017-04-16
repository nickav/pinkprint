const chalk = require('chalk')
const fileUtils = require('./file-utils')

/** Finds the blueprint template root. */
module.exports = (dirname) => {
  let cwd = process.cwd()
  let root = fileUtils.findNearestFileSync(cwd, dirname)
  if (!root) {
    console.log(chalk.red(`Error! Could not find ${dirname} directory.`))
    process.exit(1)
  }

  return root
}
