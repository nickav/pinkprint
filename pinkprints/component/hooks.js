exports.before = ({ context, helpers }) => {
  const { path, name } = context
  const { pascalcase, camelcase } = helpers
  context.name = pascalcase(context.name)
  context['full_name'] = `${camelcase(path && `${path}\\` || '')}${context.name}`
}
