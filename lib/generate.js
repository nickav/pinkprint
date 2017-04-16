const async = require('async')
const chalk = require('chalk')
const fs = require('fs')
const Handlebars = require('handlebars')
const handlebarsHelpers = require('handlebars-helpers')
const Metalsmith = require('metalsmith')
const render = require('consolidate').handlebars.render
const findRoot = require('./helpers/find-root')
const gitUser = require('./helpers/git-user')

// register all handlebars helpers
const helpers = handlebarsHelpers()
Object.keys(helpers).forEach(key => {
  Handlebars.registerHelper(key, helpers[key])
})

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
  console.log()
  async.each(keys, run, done)
  console.log()

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

module.exports = (dir, blueprint, name, options) => {
  let root = findRoot(dir)
  let blueprintSrc = `${dir}/${blueprint}`

  if (!fs.existsSync(blueprintSrc)) {
    console.log(chalk.red(
      `Blueprint folder '${blueprint}' does not exist in ${root}/${dir}`
    ))
    return false
  }

  let context = {
    author: gitUser(),
    date: new Date(),
    name,
    root
  }

  let generator =
    Metalsmith(root)
    .metadata(context)
    .clean(false)
    .source(blueprintSrc)
    .destination('.')
    .ignore('.DS_Store')
    .use(filename)
    .use(template)

  if (options.preview) {
    console.log(`Preview: Blueprint ${blueprint} ${name}`)
    generator.process(function(err) {
      if (err) throw err
    })
  } else {
    console.log(chalk.cyan(`Blueprint ${blueprint} ${name}`))
    generator.build(function(err) {
      if (err) throw err
      console.log(chalk.cyan('Done!'))
    })
  }
}
