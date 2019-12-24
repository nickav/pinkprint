# ![pink](/pink.png) pinkprint

#### _Auto-generate project files._

An easy way to quickly generate project files. Inspired by `rails generate`.

## Install

Install [yarn][yarn-install]. Then run:

```bash
> yarn add pinkprint
```

Now run `pink init`. This will create an empty config file in your project root.

### Alias

It is also recommended to add the following to your `package.json`:

```javascript
{
  "scripts": {
    "g": "bin/pink g"
  }
}
```

Now you can use `yarn g <command>` as an alias for `pink generate`.

## Getting Started

### Create a new pinkprint

```bash
> pink new component
```

This will create a new template file in your project root `./pinkprints/component.js`.

Pinkprint templates are written in vanilla JavaScript and by convention export a
default function that when called returns a string.

E.g.

```javascript
exports.default = ($, args) => `Hello ${args.name}!`;
```

### Create a new command

Commands are the main interface to pinkprint. To create a new command, add one
to your [config file](#config):

E.g.

```javascript
exports.default = {
  commands: {
    file: (ctx, argv) => {
      const template = ctx.getTemplate('component');
      const name = fs.withExtension(ctx.name, 'js');
      const args = { name };
      ctx.write(name, template(ctx.helpers, args));
    },
  },
};
```

Commands can do anything but primarily are responsible for evaluating templates
and calling `ctx.write` to output files.

### Run a command

```bash
> pink run component foobar
```

This will run the `component` command in your `pinkprint.config.js`.

In addition, you can also run `pink component foobar` as a shorthand.

## Config

The pinkprint config file (`pinkprint.config.js`) lives in your project root.

It supports the following options:

```javascript
exports.default = {
  output: {
    // path where files are written to
    path: './src',
  },

  commands: {
    file: (ctx, argv) => {},
  },
};
```

See an [example config file here](./pinkprint.config.js).

## Context

The pinkprint context contains the following:

```javascript
```

## Helpers

There are several built-in [template helpers](./src/template-helpers.js).

You can access them via `ctx.helpers`.


[prettier]: https://github.com/prettier/prettier
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
[yargs]: https://github.com/yargs/yargs
