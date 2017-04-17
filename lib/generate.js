const async = require('async')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const handlebarsHelpers = require('handlebars-helpers')
const Metalsmith = require('metalsmith')
const render = require('consolidate').handlebars.render
const findRoot = require('./helpers/find-root')
const gitUser = require('./helpers/git').user

// register all handlebars helpers
const helpers = handlebarsHelpers()
Object.keys(helpers).forEach(key => {
  Handlebars.registerHelper(key, helpers[key])
})

Handlebars.registerHelper('snakecase', (str) => (
  helpers.hyphenate(str)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
))

Handlebars.registerHelper('names', (array) => (
  (typeof array === 'string' ? [ array ] : array)
    .map(qualified => qualified.split(':').shift())
))

Handlebars.registerHelper('types', (array) => (
  (typeof array === 'string' ? [ array ] : array)
    .map(qualified => qualified.split(':').pop())
))

/** Plugin to filter out files. */
function filter (fn) {
  return function (files) {
    Object.keys(files).forEach(key => {
      if (!fn(key, files)) {
        delete files[key]
      }
    })
  }
}

const skipOverwrites = (dest) => (filter(file => {
  let exists = fs.existsSync(path.join(dest, file))
  if (exists) {
    console.log(chalk.yellow(`  Skipping ${file}`))
  }
  return !exists
}))

/** Plugin to pre-process file names with render. */
function filename (files, metalsmith, done) {
  let keys = Object.keys(files)
  let metadata = metalsmith.metadata()

  async.each(keys, run, done)

  function run (file, done) {
    if (!/{{([^{}]+)}}/g.test(file)) {
      return done()
    }

    render(file, metadata, function (err, res) {
      if (err) return done(err)
      files[res] = files[file]
      delete files[file]
      done()
    })
  }
}

/** Template in place plugin. */
function template (files, metalsmith, done) {
  let keys = Object.keys(files)
  let metadata = metalsmith.metadata()
  async.each(keys, run, done)

  function run (file, done) {
    let str = files[file].contents.toString()
    render(str, metadata, function (err, res) {
      console.log(`  ${file}`)
      if (err) return done(err)
      files[file].contents = new Buffer(res)
      done()
    })
  }
}

module.exports = (dir, blueprint, name, args, options) => {
  let root = findRoot(dir)
  let blueprintSrc = `${dir}/${blueprint}`

  if (!fs.existsSync(blueprintSrc)) {
    console.log(chalk.red(
      `Blueprint '${blueprint}' does not exist in ${root}/${dir}`
    ))
    return false
  }

  let context = {
    author: gitUser(),
    date: new Date(),
    args,
    name,
    root
  }

  let metalsmith =
    Metalsmith(root)
    .ignore('.DS_Store')
    .metadata(context)
    .clean(false)
    .source(blueprintSrc)
    .destination('.')
    .use(filter(filename => !filename.endsWith('.swp')))
    .use(filename)

  if (!options.force) {
    metalsmith.use(skipOverwrites(root))
  }

  metalsmith
    .use(template)

  if (options.preview) {
    console.log(`Previewing: Blueprint ${blueprint} ${name}\n`)
    metalsmith.process(function(err) {
      if (err) throw err
    })
  } else {
    console.log(chalk.cyan(`Blueprint ${blueprint} ${name}\n`))
    metalsmith.build(function(err) {
      if (err) throw err
      console.log(chalk.cyan('\nDone!'))
    })
  }
}
