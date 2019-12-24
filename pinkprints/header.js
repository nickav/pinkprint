exports.default = (h, { name, author, description, notes }) =>
  `
/******************************************************************************\\
* File:${h.prefix(name, ' ')}
*
* Author ${author}
*
* Description:${h.prefix(description, ' ')}
*
* Notes:${h.prefix(notes, ' ')}
\\******************************************************************************/


`;
