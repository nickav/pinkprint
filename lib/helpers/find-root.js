const chalk = require('chalk')
const path = require('path')
const utils = require('./file-utils')

/** Finds the blueprint template root. */
module.exports = (filenames, error=true) => {
  let cwd = process.cwd()
  let root

  for (i in filenames) {
    let filename = filenames[i]
    root = utils.findNearestFileSync(filename, cwd)
    if (root) break
  }

  if (!root && error) {
    console.log(`Error! Could not find ${filenames[0]} directory in:`)
    console.log(utils.parents(cwd))
    process.exit(1)
  }

  return root
}
