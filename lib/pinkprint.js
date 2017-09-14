const fs = require('fs')
const path = require('path')
const Metalsmith = require('metalsmith')
const helpers = require('./helpers/helpers')
const plugins = require('./helpers/plugins')

function loadPluginFiles(src) {
  // src is either the generate root or has generate folder and configs
  let generateSrc = path.join(src, 'generate')
  let config = {}, hooks = {}
  let loaded = false

  if (fs.existsSync(generateSrc)) {
    loaded = true
    // load config context file
    try {
      let configFile = path.join(src, 'config.json')
      config = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
    } catch (e) {}

    // load lifecycle hooks
    try {
      hooks = require(path.join(src, 'hooks.js'))
    } catch (e) {}

    src = generateSrc
  }

  return { src, config, hooks, loaded }
}

exports.default = (src, dest, context, options) => {
  var { src, config, hooks, loaded } = loadPluginFiles(src)

  if (loaded && options.verbose) {
    console.log('registered plugin files:')
    Object.keys(config).length && console.log('  config.json')
    Object.keys(hooks).length && console.log('  hooks.js')
  }

  context = Object.assign({
    $: helpers,
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

  let pinkprint = {
    context,
    helpers,
    hooks,
    ignore: metalsmith.ignore,
    metalsmith,
    options,
    use: metalsmith.use
  }

  // treat slashes in template names as relative paths
  let parts = context['name'].split('/')
  context['path'] = context['path'] || ''

  if (parts.length > 1) {
    context['name'] = parts.pop()
    let relpath = parts.join('/')
    context['path'] += `/${relpath}`
  }

  // remove leading and trailing slashes
  context = pinkprint.context
  context['path'] = context['path'].replace(/^\/+|\/+$/g, '')

  metalsmith.metadata(context)

  if (options.skipOverwrites) {
    metalsmith.use(plugins.skipOverwrites(dest))
  }

  metalsmith.use(plugins.template)

  return pinkprint
}
