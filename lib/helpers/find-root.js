const chalk = require('chalk')
const path = require('path')
const utils = require('./file-utils')

/** Finds the blueprint template root. */
module.exports = (filename) => {
  let cwd = process.cwd()
  let root = utils.findNearestFileSync(filename, cwd)
  console.log(root)

  if (!root) {
    console.log(`Error! Could not find ${filename} directory in: `)
    console.log(utils.parents(cwd))
    process.exit(1)
  }

  return root
}
