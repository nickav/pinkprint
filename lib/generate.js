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

  filenames.forEach(function(filename) {
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
    // load config context file
    try {
      let configFile = path.join(src, 'config.json')
      config = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
    } catch (e) {}

    // try to load partials
    let partialsDir = path.join(src, 'partials')
    try {
      loadPartialsDirectory(partialsDir)
    } catch (e) {}

    // load lifecycle hooks
    try {
      hooks = require(path.join(src, 'blueprint.js'))
    } catch (e) {}

    src = generateSrc
  }

  let context = {
    author: gitUser(),
    args,
    name,
    src,
    dest,
    path: ''
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
    .use(plugins.filename)

  var blueprint = {
    use: metalsmith.use,
    ignore: metalsmith.ignore,
    handlebars: Handlebars,
    helpers,
    options
  }

  typeof hooks.before === 'function' && hooks.before(context, blueprint)

  // remove leading and trailing slashes
  context['path'] = context['path'].replace(/^\/+|\/+$/g, '')
  context['path'] = context['path'] || '.'

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
      typeof hooks.after === 'function' && hooks.after(context, blueprint)
    })
  } else {
    console.log(chalk.cyan(`${templateName} ${name}\n`))

    metalsmith.build(function(err) {
      if (err) throw err
      console.log(chalk.cyan('\nDone!'))
      typeof hooks.after === 'function' && hooks.after(context, blueprint)
    })
  }
}
