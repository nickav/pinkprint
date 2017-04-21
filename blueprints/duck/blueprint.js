const path = require('path')

exports.before = (context, blueprint) => {
  let dir = path.join(context.dest, context.path)
  let files = blueprint.helpers.readdir(dir)
    .filter(file => !/\.js$/.test(file))

  if (!files.includes(context.name)) {
    files.push(context.name)
  }

  context['files'] = files
}

exports.after = (context, blueprint) => {
  console.log('after hook!')
}
