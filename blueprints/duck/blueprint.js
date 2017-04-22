const path = require('path')

exports.before = ({ context, helpers }) => {
  let dir = path.join(context.dest, context.path)
  let files = helpers.readdir(dir).filter(file => !/\.js$/.test(file))

  if (!files.includes(context.name)) {
    files.push(context.name)
  }

  context['files'] = files
}
