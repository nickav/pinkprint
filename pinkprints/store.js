const header = require('./header').default;

exports.default = (h, args) =>
  `
${header(h, args)}
//------------------------------------------------------------------------------
// Node Modules ----------------------------------------------------------------
//------------------------------------------------------------------------------
// Types -----------------------------------------------------------------------
const DO_THINGS = '${args.name}/DO_THINGS';
//------------------------------------------------------------------------------
// Selectors -------------------------------------------------------------------
//------------------------------------------------------------------------------
// Action Creators -------------------------------------------------------------
//------------------------------------------------------------------------------
// Initial State ---------------------------------------------------------------
const initialState = {};
//------------------------------------------------------------------------------
// Reducer ---------------------------------------------------------------------
export default (state = initialState, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
`.trim();