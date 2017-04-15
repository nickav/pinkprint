const mkdirp = require('mkdirp')

exports.init = () => {
  mkdirp('.blueprint')
}

exports.generate = (template, name) => {
  console.log(template, name)
}
