pinkprint
========================================

#### _Auto-generate project files._

An easy way to quickly generate project files. Based on
[Metalsmith][metalsmith]. Inspired by `rails generate`.

## Install

TODO

### Create a new pinkprint

```
> pink new component
```
This will create a template folder in your project root `pinkprints/component`.

### Generate files from a pinkprint

```
> pink generate component foobar
```
This will create all files within the `generate` folder of the `component`
template.

## Writing templates

Pinkprint templates are written in [Handlebars][handlebars] and have the
following structure:

```bash
├── config.json     # config vars available in any template
├── hooks.js        # hooks that allow you to add your own behavior
├── README.md       # how to use your template
├── generate/       # anything here will be created when running generate
├── partials/       # Handlebars partials will be auto-registered
```

### Variables

Every pinkprint template has access to the default context variables:

```javascript
author   // the git author { name, email }
args     // array of arguments passed
name     // the first required argument
src      // the source pinkprint directory
dest     // the destination (project root)
path     // relative path from dest
```
In addition to any variables in `config.json`.

### Helpers

There are several built-in Handlebars [helpers](./lib/helpers/handlebars.js).
You can also register more in the before hook.

### Hooks

If you want to add your own custom behavior, you can hook into pinkprint to add
your own behavior. Simply export whatever hooks from your template's
`hooks.js`.

The following hooks are available:

#### before(pinkprint)

The before hook gets run before the templates files are generated.

A good place to add extra variables to the context, register handlebars helpers
and so on.

#### after(pinkprint)

This gets run after the template files are generated successfully.

#### pinkprint

The pinkprint object has the following properties:

```javascript
context       // Handlebars context variables
handlebars    // Handlebars object
helpers       // pinkprint built-in helpers
ignore        // alias for metalsmith.ignore
options       // any command-line options
use           // alias for metalsmith.use
```

[handlebars]: http://handlebarsjs.com/
[metalsmith]: https://github.com/segmentio/metalsmith
[prettier]: https://github.com/prettier/prettier
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
