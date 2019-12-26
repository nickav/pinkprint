const path = require('path');

exports.default = {
  output: {
    path: './src',
  },

  commands: {
    helper: {
      description: 'Creates a new helper file',
      args: ['author', 'description', 'notes'],

      run: (ctx, argv) =>
        ctx.print('header.js', 'helpers', {
          description: argv.description || '',
          notes: argv.notes || '',
        }),
    },

    style: (ctx, argv) => ctx.print('style.scss', 'style'),

    component: (ctx, argv) => {
      const { helpers } = ctx;
      console.log(argv.name);

      const parts = argv.name.split('.');
      const last = parts.pop();
      argv.name = parts.join('.') + '.' + helpers.pascal(last);

      ctx.print('Component.jsx', 'components', {
        description: argv.description || '',
        notes: argv.notes || '',
      });

      ctx.print('style.scss', 'components');
    },
  },
};
