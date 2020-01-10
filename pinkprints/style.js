exports.default = {
  name: (name, h) => h.pascal(name),
  extension: '.scss',
  basePath: 'style',
  generate: (args) =>
    `
.${args.name} {
}
`.trim(),
};
