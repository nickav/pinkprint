const async = require('async')
const chalk = require('chalk')
const fs = require('fs')
const Metalsmith = require('metalsmith')
const render = require('consolidate').handlebars.render
const findRoot = require('./helpers/find-root')
const gitUser = require('./helpers/git-user')

/** Template in place plugin. */
function template (files, metalsmith, done){
  var keys = Object.keys(files)
  var metadata = metalsmith.metadata()

  async.each(keys, run, done)

  function run (file, done) {
    var str = files[file].contents.toString()
    render(str, metadata, function (err, res) {
      if (err) return done(err)
      files[file].contents = new Buffer(res)
      done()
    })
  }
}

module.exports = (dir, blueprint, name) => {
  let context = {
    author: gitUser(),
    date: new Date(),
    name
  }

  let root = findRoot(dir)

  let blueprintSrc = `${dir}/${blueprint}`
  if (!fs.existsSync(blueprintSrc)) {
    console.log(chalk.red(
      `Blueprint folder '${blueprint}' does not exist in ${root}/${dir}`
    ))
    return false
  }

  console.log(`Creating blueprint ${blueprint}...`)

  Metalsmith(root)
    .metadata(context)
    .clean(false)
    .source(blueprintSrc)
    .destination(`${blueprint}/${name}`)
    .use(template)
    .build(function(err) {
      if (err) throw err
      console.log('Build finished!')
    })
}
