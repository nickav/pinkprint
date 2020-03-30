exports.default = {
  output: {
    path: './output',
  },

  commands: {
    // The most basic print which defaults to using the
    // template file with name of the command
    hello: (ctx) => ctx.print(),

    // A print using the template file hello.js the basePath ./greetings
    greet: (ctx) => ctx.print('hello', { basePath: 'greetings' }),

    // A print without a template file with the
    // required generate property
    foo: (ctx) =>
      ctx.print('foo', {
        extension: '.foo',
        generate: (args) =>
          `A foo file without a template file named ${args.name}`,
      }),

    // A print that doesn't require name from command line
    idx: (ctx) => ctx.print(),

    // A command with meta information and uses the default fileName function
    helper: {
      description: 'Creates a new helper file',
      args: ['author', 'description', 'notes'],

      run: (ctx) => ctx.print('header', { basePath: 'utils' }),
    },

    // A print that overrides the extension in the template file
    style: (ctx) => ctx.print('style', { extension: '.css' }),

    // A command that prints multiple files
    component: (ctx) => {
      ctx.print('component', { basePath: 'components' });
      ctx.print('style', { basePath: 'components' });
    },

    // An example of files that depend on previous files being generated first
    store: async (ctx) => {
      await ctx.print('store', { basePath: 'store' });

      ctx.print('reducer', { basePath: 'store' });
    },
  },
};
