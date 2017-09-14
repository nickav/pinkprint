const path = require('path')
const fs = require('fs')

exports.before = ({ context, helpers }) => {
  // force name and path to be camelcase, add full_name context var
  const { pascalcase, camelcase } = helpers
  context.name = pascalcase(context.name)
  context.path = camelcase(context.path)
  const pathWithSlash = context.path && `${context.path}\\` || ''
  context['full_name'] = `${pathWithSlash}${context.name}`

  // parse svg icon
  const { argv } = context
  const iconPath = argv.args.slice().pop()

  if (!iconPath) throw 'Please specify an svg icon'
  if (!iconPath.endsWith('svg')) {
    throw `Expecting a path to an SVG. Got ${iconPath}`
  }

  const fullIconPath = path.resolve(process.cwd(), iconPath)

  if (!fs.existsSync(fullIconPath)) {
    throw `File doesn't exist: ${fullIconPath}`
  }

  const svg = fs.readFileSync(fullIconPath).toString()

  const viewbox = svg.match(/viewBox="([^"]+)"/)
  context['viewbox'] = viewbox.length && viewbox[1] || '0 0 0 0'

  context['svg'] = svg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .replace(/-([a-z])/g, g => g[1].toUpperCase())
}
