![pink](/pink.png) pinkprint
========================================

#### _Auto-generate project files._

An easy way to quickly generate project files. Based on
[Metalsmith][metalsmith]. Inspired by `rails generate`.

## Install

Install [yarn][yarn-install]. Then run:
```bash
> yarn add pinkprint
```

### Create a new pinkprint

```bash
> pink new component
```
This will create a template folder in your project root `pinkprints/component`.

### Generate files from a pinkprint

```bash
> pink generate component foobar
```
This will create all files within the `generate` folder of the `component`
template.

## Writing templates

Pinkprint templates are written in [ejs][ejs] and have the
following structure:

```bash
├── config.json     # config vars available in any template
├── hooks.js        # hooks that allow you to add your own behavior
├── README.md       # how to use your template
├── generate/       # anything here will be created when running generate
```

### Variables

Every pinkprint template has access to the default context variables:

```javascript
$        // alias for helpers
author   // the git author { name, email }
argv     // object of cli arguments
name     // the name of the new pinkprint
src      // the source pinkprint directory
dest     // the destination
path     // relative path from dest
```
In addition to any variables in `config.json`.

### Helpers

There are several built-in [helpers](./lib/helpers/helpers.js).
You can also register more in the before hook.

### Hooks

If you want to add your own custom behavior, pinkprint exposes a few lifecycle
methods. Simply export the hooks from your template's `hooks.js`.

The following hooks are available:

#### before(pinkprint)

The before hook gets run before the templates files are generated.

A good place to add extra variables to the context, register helpers and so on.

#### after(pinkprint)

This gets run after the template files are generated successfully.

#### pinkprint

The pinkprint object has the following properties:

```javascript
context       // context variables
helpers       // pinkprint built-in helpers
hooks         // registered hooks
ignore        // alias for metalsmith.ignore
metalsmith    // the metalsmith instance
options       // any command-line options
use           // alias for metalsmith.use
```

[ejs]: http://ejs.co/
[metalsmith]: https://github.com/segmentio/metalsmith
[prettier]: https://github.com/prettier/prettier
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
