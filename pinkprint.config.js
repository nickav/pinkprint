const path = require('path');

exports.default = {
  output: {
    path: './src',
  },

  commands: {
    helper: {
      description: 'Creates a new helper file',
      args: ['author', 'description', 'notes'],

      run: (ctx, argv) => {
        const { fs } = ctx;

        const template = ctx.getTemplate('header');
        const name = fs.withExtension(ctx.name, 'js');

        const args = {
          name,
          author: argv.author || ctx.getAuthor(),
          description: argv.description || '',
          notes: argv.notes || '',
        };

        const contents = template(ctx.helpers, args).trimStart();
        fs.write(path.resolve('helpers', args.name), contents);
      },
    },

    /*
    style: (ctx) => {
      const scss = require('./pinkprints/style.scss').default;

      return scss({
        name: ctx.filename,
      }).trim();
    },

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
