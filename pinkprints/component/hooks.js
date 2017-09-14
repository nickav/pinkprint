exports.before = ({ context, helpers }) => {
  const { pascalcase, camelcase } = helpers
  context.name = pascalcase(context.name)
  context.path = camelcase(context.path)
  context['full_name'] = `${context.path && `${context.path}\\` || ''}${context.name}`
}
