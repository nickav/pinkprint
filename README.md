# ![pink](/pink.png) pinkprint

#### _Auto-generate project files._

An easy way to quickly generate project files. Inspired by `rails generate`.

## Install

Install [yarn][yarn-install]. Then run:

```bash
> yarn add pinkprint
```

Now run `pink init`. This will create an empty config file in your project root.

## Getting Started

### Create a new pinkprint

```bash
> pink new hello
```

This will create a new template file in your project root `./pinkprints/hello.js`.

Pinkprint templates are written in vanilla JavaScript and by convention export a
default function that returns a string.

```javascript
// ./pinkprints/hello.js
exports.default = ($, args) => `Hello ${args.name}!`;
```

### Create a new command

Commands are the main interface to pinkprint. To create a new command, add one
to your [config file](#config).

```javascript
// pinkprint.config.js

exports.default = {
  commands: {
    file: (ctx, argv) => ctx.print('file', 'src/files'),
  },
};
```

Now you can run the command with `pink g file name`.

### Run a command

```bash
> pink generate component foobar
```

This will run the `component` command in your `pinkprint.config.js`.

You can also use `pink component foobar` as a shorthand.

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

## Context

The pinkprint context contains the following:

```javascript
{
  projectRoot: '/Users/nick/dev/pinkprint',
  templateDir: '/Users/nick/dev/pinkprint/pinkprints',
  configFile: '/Users/nick/dev/pinkprint/pinkprint.config.js',
  config: { output: { path: './src' }, commands: { helper: [Object] } },
  name: 'foo.bar',
  getAuthor: [Function: getAuthor],
  getGitUser: [Function],
  getPackageJson: [Function: getPackageJson],
  getTemplate: [Function: getTemplate],
  require: [Function: requireSafe],
  helpers: {
    camel: [Function: camelize],
    pascal: [Function: pascalize],
    snake: [Function: decamelize],
    kebob: [Function],
    plural: [Function: pluralize],
    upper: [Function],
    lower: [Function],
    prefix: [Function],
    sqldate: [Function],
    moment: [Function: dateHelper],
    join: [Function],
    default: [Function]
  },
  fs: {
    basePath: '/Users/nick/dev/pinkprint/src',
    defaultExtension: '',
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

## Helpers

There are several built-in [template helpers](./src/template-helpers.js).

You can access them via `ctx.helpers`.

[prettier]: https://github.com/prettier/prettier
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
[yargs]: https://github.com/yargs/yargs
