exports.default = {
  commands: {
    file: {
      description: 'Creates a new js file with a header',
      args: ['author', 'description', 'notes'],
      run: (ctx) => {
        const file = require('./pinkprints/file.js');

        return file({
          name: ctx.filename,
          author: ctx.argv.author || '',
          description: ctx.argv.description || '',
          notes: ctx.argv.notes || '',
        }).trimStart();
      },
    },

    style: (ctx) => {
      const scss = require('./pinkprints/style.scss.js');

      return scss({
        name: ctx.filename,
      }).trim();
    },
  },
};
