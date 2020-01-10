# ![pink](/pink.png) pinkprint

#### _Auto-generate project files._

An easy way to quickly generate project files. Inspired by `rails generate`.

## Install

Install [yarn][yarn-install]. Then run:

```bash
> yarn add pinkprint
```

Now run `pink init`. This will create an empty [config file](#config) in your project root.

## Getting Started

### Create a new pinkprint

```bash
> pink new hello
```

This will create a new template file in your project root `./pinkprints/hello.js`.

Pinkprint templates are written in JavaScript and export a
default object in the following shape:

```javascript
// ./pinkprints/hello.js
exports.default = {
  name: (name, h) => 'hello',           // function to generate file name
  extension: '.js',                     // file extension
  generate: (args, h, argv, ctx) => ``, // function returning string
  pre: (args, h, argv, ctx) => {},      // function that runs before `generate`
  post: (args, h, argv, ctx) => {},     // function that runs after `generate`
}
```

### Create a new command

Commands are the main interface to pinkprint. To create a new command, add one
to your [config file](#config).

```javascript
// pinkprint.config.js

exports.default = {
  commands: {
    greet: (ctx, argv) => ctx.print('hello', { basePath: 'src/greetings' }),
  },
};
```

Now you can run the command with `pink g greet World`. This will create a new
file `./src/greetings/World.js`

### Run a command

```bash
> pink generate component foobar
```

This will run the `component` command in your `pinkprint.config.js`.

More examples:

```bash
> pink component foobar               # shorthand for pink generate component
> pink g component common.MyComponent # output to src/common
```

#### Generate Alias

It is also recommended to add the following to your `package.json`:

```javascript
{
  "scripts": {
    "g": "bin/pink g"
  }
}
```

Now you can use `yarn g <command>` as an alias for `pink generate`.

## Config

The pinkprint config file lives in your project root and is named `pinkprint.config.js`.

It supports the following options:

```javascript
exports.default = {
  output: {
    // path where files are written to
    path: './src',
  },

  commands: {
    // all commands live here
    file: (ctx, argv) => ctx.print('file', 'src/files'),
  },
};
```

See an [example config file here](./pinkprint.config.js).

## API

### Context

Every command has access to the context and the argv object (from [yargs][yargs]).
The pinkprint context contains the following:

```javascript
{
  projectRoot: '/Users/nick/dev/pinkprint',
  templateDir: '/Users/nick/dev/pinkprint/pinkprints',
  configFile: '/Users/nick/dev/pinkprint/pinkprint.config.js',
  config: {}, // loaded config file
  path: '',
  name: 'world',
  getPackageJson: [Function: getPackageJson],
  getAuthor: [Function: getAuthor],
  getGitUser: [Function],
  getTemplate: [Function: getTemplate],
  print: [Function: print],
  beginPrint: [Function: beginPrint],
  commitPrint: [Function: commitPrint],
  assert: [Function],
  require: [Function],
  helpers: {}, // template helpers
  fs: {
    mount: '/Users/nick/dev/pinkprint/src',
    defaultExtension: '',
    relativePath: '/Users/nick/dev/pinkprint',
    noWrite: true,
    setDefaultExtension: [Function: setDefaultExtension],
    withExtension: [Function: withExtension],
    resolvePath: [Function: resolvePath],
    write: [Function: write],
    writeFile: [Function: writeFile],
    mkdirp: [Function: mkdirp],
    readFileSync: [Function: readFileSync],
    readDirSync: [Function: readDirSync]
  }
}
```

### Helpers

There are several built-in [template helpers](./src/template-helpers.js).

You can access them via `ctx.helpers`.

[prettier]: https://github.com/prettier/prettier
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
[yargs]: https://github.com/yargs/yargs
