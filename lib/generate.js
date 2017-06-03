const chalk = require('chalk')
const fs = require('fs')
const assert = require('./helpers/assert')
const gitUser = require('./helpers/git').user
const createBlueprint = require('./blueprint').default

module.exports = (src, dest, name, args, options = {}) => {
  options.verbose && console.time('total')
  let templateName = src.split('/').pop()

  // treat slashes in template names as relative paths
  let parts = name.split('/')
  if (parts.length > 1) {
    context['name'] = parts.pop()
    let relpath = parts.join('/')
    context['path'] += '/' + parts.join('/')
  }

  // make sure we have the blueprint specified
  assert(
    fs.existsSync(src),
    `Blueprint '${templateName}' does not exist in ${src}` + `\nSee 'blue list'`
  )

  let context = {
    args,
    author: gitUser(),
    name
  }

  let blueprint = createBlueprint(src, dest, context, options)

  let hooks = blueprint.hooks
  typeof hooks.before === 'function' && hooks.before(blueprint)

  // remove leading and trailing slashes
  context = blueprint.context
  context['path'] = context['path'].replace(/^\/+|\/+$/g, '')
  context['path'] = context['path'] || '.'

  options.verbose && console.log('\ncontext:\n', context, '\n')

  if (options.preview) {
    console.log(`Preview: ${templateName} ${name}\n`)

    blueprint.metalsmith.process(function(err, files) {
      if (err) throw err
      console.log()
      options.verbose && console.timeEnd('total')
      typeof hooks.after === 'function' && hooks.after(blueprint)
    })
  } else {
    console.log(chalk.cyan(`${templateName} ${name}\n`))

    blueprint.metalsmith.build(function(err) {
      if (err) throw err
      console.log(chalk.cyan('\nDone!'))
      options.verbose && console.timeEnd('total')
      typeof hooks.after === 'function' && hooks.after(blueprint)
    })
  }
}
