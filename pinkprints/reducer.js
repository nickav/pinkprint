const header = require('./header').default;

const indent = (arr, spaces = 2) => arr.map((e) => ' '.repeat(spaces) + e);
const commas = (arr) => arr.map((e) => `${e},`);
const importStatement = (file) => `import ${file} from './${file}';`;

exports.default = (h, args) =>
  `
// Auto-generated via \`yarn g store\`

//------------------------------------------------------------------------------
// Node Modules ----------------------------------------------------------------
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
//------------------------------------------------------------------------------
// History ---------------------------------------------------------------------
import history from '@/helpers/history';
//------------------------------------------------------------------------------
// Reducers --------------------------------------------------------------------
${args.files.map(importStatement).join('\n')}
//------------------------------------------------------------------------------
// Root Reducer ----------------------------------------------------------------
export default combineReducers({
${indent(commas(args.files), 2).join('\n')}
  router: connectRouter(history),
});
`.trim();
