const fs = require('fs')
const findRoot = require('./helpers/find-root')

module.exports = (dir, blueprint) => {
  let root = findRoot(dir)
  let files = fs.readdirSync(root)
  files.forEach(file => console.log(file))
}
