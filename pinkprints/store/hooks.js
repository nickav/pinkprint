const path = require('path')

exports.before = ({ context, helpers }) => {
  let dir = path.join(context.dest, context.path, 'src', 'store')
  let files = helpers.readdir(dir).filter(file => !file.startsWith('.') && !/\.js$/.test(file))

  if (!files.includes(context.name)) {
    files.push(context.name)
  }

  context['files'] = files.map(file => helpers.snakecase(file))
  context.name = helpers.snakecase(context.name)
}
