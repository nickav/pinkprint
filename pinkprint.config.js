exports.default = {
  output: {
    path: './src',
  },

  commands: {
    file: {
      description: 'Creates a new js file with a header',
      args: ['author', 'description', 'notes'],
      run: (ctx, argv) => {
        const file = require('./pinkprints/header').default;

        ctx.fs.defaultExtension = 'js';

        ctx.fs.writeFile(
          ctx.name,
          file({
            name: ctx.name || '',
            author: argv.author || '',
            description: argv.description || '',
            notes: argv.notes || '',
          }).trimStart()
        );
      },
    },

    helper: {
      description: 'Creates a new helper file',
      args: ['author', 'description', 'notes'],
      run: (ctx, argv) => {
        const file = require('./pinkprints/header').default;

        const contents = file({
          name: ctx.name,
          author: argv.author || '',
          description: argv.description || '',
          notes: argv.notes || '',
        }).trimStart();

        ctx.fs.writeFile(ctx.name, contents);
      },
    },

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
  },
};
