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
        ctx.doTemplate('header.js', 'helpers', {
          description: argv.description || '',
          notes: argv.notes || '',
        }),
    },

    style: (ctx, argv) => ctx.doTemplate('style.scss', 'style'),

    component: (ctx, argv) => {
      const t = ctx.beginTemplate('Component.jsx', 'components');
      ctx.commitTemplate(t);
    },

    /*
    component: (ctx, argv) => {
      const Component = require('./pinkprints/Component.jsx').default;

      console.log(
        Component({
          name: ctx.name,
          author: argv.author || '',
          description: argv.description || '',
          notes: argv.notes || '',
        }).trim()
      );
    },
    */
  },
};
