const fs = require('fs')
const path = require('path')
const async = require('async')
const render = require('consolidate').handlebars.render

/** Plugin to filter out files. */
exports.filter = fn => files =>
  Object.keys(files).forEach(key => {
    if (!fn(key, files)) {
      delete files[key]
    }
  })

exports.skipOverwrites = dest =>
  filter((file, files) => {
    let exists = fs.existsSync(path.join(dest, file))
    if (exists) {
      console.log(chalk.yellow(`  skipping ${file}`))
    }
    return !exists
  })

/** Plugin to pre-process file names with render. */
exports.filename = (files, metalsmith, done) => {
  let keys = Object.keys(files)
  let metadata = metalsmith.metadata()

  async.each(keys, run, done)

  function run(file, done) {
    if (!/{{([^{}]+)}}/g.test(file)) {
      return done()
    }

    render(file, metadata, function(err, res) {
      if (err) return done(err)
      files[res] = files[file]
      delete files[file]
      done()
    })
  }
}

/** Template in place plugin. */
exports.template = (files, metalsmith, done) => {
  let keys = Object.keys(files)
  let metadata = metalsmith.metadata()
  async.each(keys, run, done)

  function run(file, done) {
    let str = files[file].contents.toString()
    render(str, metadata, function(err, res) {
      console.log(`  create ${file}`)
      if (err) return done(err)
      files[file].contents = new Buffer(res)
      done()
    })
  }
}
