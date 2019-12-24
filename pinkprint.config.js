const path = require('path');

exports.default = {
  output: {
    path: './src',
  },

  commands: {
    /*
    file: {
      description: 'Creates a new js file with a header',
      args: ['author', 'description', 'notes'],
      run: (ctx, argv) => {
        const header = require('./pinkprints/header').default;

        ctx.fs.defaultExtension = 'js';

        ctx.fs.writeFile(
          ctx.name,
          header({
            name: ctx.name || '',
            author: argv.author || '',
            description: argv.description || '',
            notes: argv.notes || '',
          }).trimStart()
        );
      },
    },
    */

    helper: {
      description: 'Creates a new helper file',
      args: ['author', 'description', 'notes'],

      run: (ctx, argv) => {
        const header = require('./pinkprints/header').default;

        ctx.fs.defaultExtension = 'js';
        ctx.fs.basePath = path.join(ctx.fs.basePath, 'helpers');
        const filepath = ctx.fs.getFilePath(ctx.name);
        console.log(ctx);

        const user = ctx.getGitUser();
        const packageJson = ctx.getPackageJson();
        const author = argv.author || packageJson.author || user.name || '';

        const contents = header(ctx.helpers, {
          name: ctx.name,
          author,
          description: argv.description || '',
          notes: argv.notes || '',
        }).trimStart();

        ctx.fs.writeFile(ctx.name, contents);
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
