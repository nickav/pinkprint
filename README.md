# ![pink](/pink.png) pinkprint

#### _Auto-generate project files._

An easy way to quickly generate project files. Inspired by `rails generate`.

## Install

Install [yarn][yarn-install]. Then run:

```bash
> yarn add pinkprint
```

Now, run `pink init`. This will create an empty config file in your project root.

### Alias

pinkprint will now be added to your project. It is also recommended to add the
following to your `package.json`:

```javascript
{
  "scripts": {
    "g": "bin/pink g"
  }
}
```

Now you can run `yarn g <template>`, an alias for generate.

### Create a new pinkprint

```bash
> pink new component
```

This will create a template folder in your project root `pinkprints/component.js`.

Pinkprint templates are written in vanilla JavaScript and have should have a
export a function that when called returns a string.

E.g.

```javascript
export default (ctx) => `Hello ${ctx.name}!`;
```

### Generate files from a pinkprint

```bash
> pink generate component foobar
```

This will create all files within the `generate` folder of the `component`
template.

In addition, you can also run `pink component foobar` as shorthand.

### Context

Every pinkprint command has access to the following context variables:

```javascript
$; // alias for helpers
author; // the git author { name, email }
argv; // object of cli arguments
name; // the name of the new pinkprint
src; // the source pinkprint directory
dest; // the destination
path; // relative path from dest
```

### Helpers

There are several built-in [helpers](./src/helpers.js).
You can also register more in the before hook.

[prettier]: https://github.com/prettier/prettier
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
