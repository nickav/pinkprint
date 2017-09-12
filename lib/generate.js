const chalk = require('chalk')
const fs = require('fs')
const assert = require('./helpers/assert')
const gitUser = require('./helpers/git').user
const createPinkprint = require('./pinkprint').default

module.exports = (src, dest, name, args, options = {}) => {
  options.verbose && console.time('total')
  let templateName = src.split('/').pop()

  // make sure we have the pinkprint specified
  assert(
    fs.existsSync(src),
    `Pinkprint '${templateName}' does not exist in ${src}` + `\nSee 'pink list'`
  )

  let context = {
    args,
    author: gitUser(),
    name
  }

  let pinkprint = createPinkprint(src, dest, context, options)

  // before hook
  let hooks = pinkprint.hooks
  typeof hooks.before === 'function' && hooks.before(pinkprint)

  options.verbose && console.log('\ncontext:\n', context, '\n')

  if (options.preview) {
    console.log(`Preview: ${templateName} ${name}\n`)

    pinkprint.metalsmith.process(function(err, files) {
      if (err) throw err
      console.log()
      options.verbose && console.timeEnd('total')
      typeof hooks.after === 'function' && hooks.after(pinkprint)
    })
  } else {
    console.log(chalk.magenta(`${templateName} ${name}\n`))

    pinkprint.metalsmith.build(function(err) {
      if (err) throw err
      console.log(chalk.magenta('\nDone!'))
      options.verbose && console.timeEnd('total')

      // after hook
      typeof hooks.after === 'function' && hooks.after(pinkprint)
    })
  }
}
