exports.default = {
  pre: (args, h, argv) => {
    args.description = argv.description || '';
    args.notes = argv.notes || '';
  },
  generate: ({ fileName, author, description, notes }, h) =>
    `
/******************************************************************************\\
* File: ${fileName}
*
* Author: ${author}
*
* Description:${h.prefix(description, ' ')}
*
* Notes:${h.prefix(notes, ' ')}
\\******************************************************************************/
`.trimStart(),
};
