exports.default = {
  name: (name, h) => h.pascal(name),

  extension: '.jsx',

  pre: async (args, h, argv, ctx) => {
    args.header = await ctx.string('header', {}, args.template);
  },

  generate: (args) =>
    `
${args.header}
// -----------------------------------------------------------------------------
// Node Modules ----------------------------------------------------------------
import React from 'react';
import classNames from 'classnames';
// -----------------------------------------------------------------------------
// Style -----------------------------------------------------------------------
import styles from './${args.name}.scss';
//------------------------------------------------------------------------------
// Components ------------------------------------------------------------------
//------------------------------------------------------------------------------
// React Class -----------------------------------------------------------------
class ${args.name} extends React.Component {
render() {
  const { className } = this.props;

  const cn = classNames(styles.${args.name}, className, {});

  return (
    <div className={cn}>
    </div>
  );
}
};
//------------------------------------------------------------------------------
// Export ----------------------------------------------------------------------
export default ${args.name};
`.trim(),
};
