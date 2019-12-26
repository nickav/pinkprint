exports.default = (h, { fileName, author, description, notes }) =>
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
`.trimStart();
