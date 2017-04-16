const Metalsmith = require('metalsmith')
const gitUser = require('./helpers/git-user')
const fileUtils = require('./helpers/file-utils')

module.exports = (dir, template, name) => {
  let context = {
    date: new Date(),
    author: gitUser()
  }
  console.log(template, name, context)
  let root = fileUtils.findNearestFileSync(dir, __dirname)
  Metalsmith(root)
    .clean(false)
    .source(`${dir}/${template}`)
    .destination(`${template}/${name}`)
    .use(middleware)
    .build(function(err) {
      if (err) throw err
      console.log('Build finished!')
    })
}

function middleware(files, metalsmith, done) {
  const metadata = metalsmith.metadata()
  console.log('middleware', files, metadata)
  done()
}
