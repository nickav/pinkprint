const fs = require('fs')
const path = require('path')
const async = require('async')
const render = require('consolidate').ejs.render

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
exports.filename = verbose => (files, metalsmith, done) => {
  const keys = Object.keys(files)
  const metadata = metalsmith.metadata()

  async.each(keys, run, done)

  function run(file, done) {
    render(file, metadata, function(err, res) {
      if (err) return done(err)
      // replace single unescaped backslash with a forward slash
      res = res.replace(/[\w]\\[\w]/g, m => `${m[0]}/${m[2]}`)
      // replace double slashes with a single slash
      res = res.replace(/\/\//g, '/')
      files[res] = files[file]
      if (res !== file) {
        delete files[file]
        verbose && console.log('  rename', file, '->', res)
      }
      done()
    })
  }
}

/** Template in place plugin. */
exports.template = (type, verbose) => (files, metalsmith, done) => {
  const ext = new RegExp(`[^\\\\]\.${type}$`)
  const escapeExt = new RegExp(`\\\\\.${type}$`)

  const keys = Object.keys(files).filter(file => file.match(ext) || file.match(escapeExt))
  const metadata = metalsmith.metadata()

  async.each(keys, run, done)

  function run(file, done) {
    // rename escaped file name
    if (file.match(escapeExt)) {
      const rename = file.replace(escapeExt, `.${type}`)
      files[rename] = files[file]
      delete files[file]
      verbose && console.log('  unescape', file, '->', rename)
      return done()
    }

    // process template file
    const str = files[file].contents.toString()
    render(str, metadata, function(err, res) {
      const rename = file.replace(ext, '')
      if (err) return done(err)
      files[rename] = files[file]
      files[rename].contents = new Buffer(res)
      delete files[file]
      verbose && console.log('  apply template', type, file, '->', rename)
      done()
    })
  }
}
