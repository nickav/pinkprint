const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const Metalsmith = require('metalsmith')
const assert = require('./helpers/assert')
const file = require('./helpers/file-utils')
const findRoot = require('./helpers/find-root')
const gitUser = require('./helpers/git').user
const helpers = require('./helpers/handlebars')
const plugins = require('./helpers/plugins')

// register all handlebars helpers
Handlebars.registerHelper(helpers)

function loadPartialsDirectory(partialsDir) {
  var filenames = fs.readdirSync(partialsDir)

  return filenames.forEach(function(filename) {
    var matches = /^([^.]+).hbs$/.exec(filename)
    if (!matches) {
      return
    }
    var name = matches[1]
    var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8')
    Handlebars.registerPartial(name, template)
  })
}

module.exports = (src, dest, name, args, options = {}) => {
  options.verbose && console.time('total')
  let templateName = src.split('/').pop()

  // make sure we have the blueprint specified
  assert(
    fs.existsSync(src),
    `Blueprint '${templateName}' does not exist in ${src}` + `\nSee 'blue list'`
  )

  let config = {}
  let hooks = {}

  // src is either the generate root or has generate folder and configs
  let generateSrc = path.join(src, 'generate')

  if (fs.existsSync(generateSrc)) {
    options.verbose && console.log('registering plugin files:')
    // load config context file
    try {
      let configFile = path.join(src, 'config.json')
      config = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
      options.verbose && console.log('  config.json')
    } catch (e) {}

    // try to load partials
    let partialsDir = path.join(src, 'partials')
    try {
      loadPartialsDirectory(partialsDir)
      options.verbose && console.log('  partials')
    } catch (e) {}

    // load lifecycle hooks
    try {
      hooks = require(path.join(src, 'hooks.js'))
      options.verbose && console.log('  hooks.js')
    } catch (e) {}

    src = generateSrc
  }

  let context = {
    args,
    author: gitUser(),
    dest,
    name,
    path: '',
    src
  }

  context = Object.assign({}, context, config)

  // treat slashes in template names as relative paths
  let parts = name.split('/')
  if (parts.length > 1) {
    context['name'] = parts.pop()
    let relpath = parts.join('/')
    context['path'] += '/' + parts.join('/')
  }

  var metalsmith = Metalsmith(dest)
    .ignore('.DS_Store')
    .clean(false)
    .source(src)
    .destination('.')
    .use(plugins.filter(filename => !filename.endsWith('.swp')))
    .use(plugins.filename(options.verbose))

  var blueprint = {
    context,
    handlebars: Handlebars,
    helpers,
    ignore: metalsmith.ignore,
    options,
    use: metalsmith.use
  }

  typeof hooks.before === 'function' && hooks.before(blueprint)

  // remove leading and trailing slashes
  context['path'] = context['path'].replace(/^\/+|\/+$/g, '')
  context['path'] = context['path'] || '.'

  options.verbose && console.log('\ncontext:\n', context, '\n')

  metalsmith.metadata(context)

  if (options.skipOverwrites) {
    metalsmith.use(skipOverwrites(dest))
  }

  metalsmith.use(plugins.template)

  if (options.preview) {
    console.log(`Preview: ${templateName} ${name}\n`)

    metalsmith.process(function(err) {
      if (err) throw err
      console.log()
      options.verbose && console.timeEnd('total')
      typeof hooks.after === 'function' && hooks.after(blueprint)
    })
  } else {
    console.log(chalk.cyan(`${templateName} ${name}\n`))

    metalsmith.build(function(err) {
      if (err) throw err
      console.log(chalk.cyan('\nDone!'))
      options.verbose && console.timeEnd('total')
      typeof hooks.after === 'function' && hooks.after(blueprint)
    })
  }
}
