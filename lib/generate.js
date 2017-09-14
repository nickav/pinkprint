const chalk = require('chalk')
const fs = require('fs')
const assert = require('./helpers/assert')
const gitUser = require('./helpers/git').user
const createPinkprint = require('./pinkprint').default

module.exports = (src, dest, name, argv = {}) => {
  argv.verbose && console.time('total')
  let templateName = src.split('/').pop()

  // make sure we have the pinkprint specified
  assert(
    fs.existsSync(src),
    `Pinkprint '${templateName}' does not exist in ${src}` + `\nSee 'pink list'`
  )

  let context = {
    ...argv,
    author: gitUser(),
    name
  }

  let pinkprint = createPinkprint(src, dest, context, argv)

  // before hook
  let hooks = pinkprint.hooks
  typeof hooks.before === 'function' && hooks.before(pinkprint)

  argv.verbose && console.log('\ncontext:\n', context, '\n')

  if (argv.preview) console.log(`Preview:`)
  console.log(chalk.magenta(`${templateName} ${name}\n`))

  // generate the files
  const run = argv.preview ? 'process' : 'build'
  pinkprint.metalsmith[run](function(err) {
    if (err) throw err

      // timing
      console.log(chalk.magenta('\nDone!'))
      argv.verbose && console.timeEnd('total')

      // after hook
      typeof hooks.after === 'function' && hooks.after(pinkprint)
  })
}
