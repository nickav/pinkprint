const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const Metalsmith = require('metalsmith')
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

function loadPluginFiles(src) {
  // src is either the generate root or has generate folder and configs
  let generateSrc = path.join(src, 'generate')
  let config = {}, hooks = {}, partials = {}
  let loaded = false

  if (fs.existsSync(generateSrc)) {
    loaded = true
    // load config context file
    try {
      let configFile = path.join(src, 'config.json')
      config = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
    } catch (e) {}

    // try to load partials
    let partialsDir = path.join(src, 'partials')
    try {
      partials = loadPartialsDirectory(partialsDir)
    } catch (e) {}

    // load lifecycle hooks
    try {
      hooks = require(path.join(src, 'hooks.js'))
    } catch (e) {}

    src = generateSrc
  }

  return { src, config, hooks, partials, loaded }
}

exports.default = (src, dest, context, options) => {
  var { src, config, hooks, partials, loaded } = loadPluginFiles(src)

  if (loaded && options.verbose) {
    console.log('registered plugin files:')
    Object.keys(config).length && console.log('  config.json')
    Object.keys(hooks).length && console.log('  hooks.js')
    Object.keys(partials).length && console.log('  partials')
  }

  context = Object.assign({
    dest,
    path: '',
    src
  }, context, config)

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
    hooks,
    ignore: metalsmith.ignore,
    metalsmith,
    options,
    use: metalsmith.use
  }

  // treat slashes in template names as relative paths
  let parts = context['name'].split('/')
  if (parts.length > 1) {
    context['name'] = parts.pop()
    let relpath = parts.join('/')
    context['path'] = `${context['path'] || ''}/${relpath}`
  }

  // remove leading and trailing slashes
  context = blueprint.context
  context['path'] = context['path'].replace(/^\/+|\/+$/g, '')
  context['path'] = context['path'] || '.'

  console.log(context)

  metalsmith.metadata(context)

  if (options.skipOverwrites) {
    metalsmith.use(plugins.skipOverwrites(dest))
  }

  metalsmith.use(plugins.template)

  return blueprint
}
