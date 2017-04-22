blueprint
========================================

#### _Auto-generate project files._

An easy way to quickly generate project files. Based on
[Metalsmith](metalsmith). Inspired by `rails generate`.

## Install

TODO

### Create a new blueprint
```
> blue new component
```
This will create a template folder in your project root `blueprints/component`.

### Generate files from a blueprint
```
> blue generate component foobar
```
This will create all files within the `generate` folder of the `component`
template.

## Writing templates

Blueprint templates are written in [Handlebars](handlebars). And have the
following structure:

```bash
├── config.json     # config vars available in any template
├── blueprint.js    # hooks that allow you to add your own behavior
├── README.md       # how to use your template
├── generate/       # Webpack builds the static site into this directory
├── partials/       # Handlebars partials will be auto-registered
```

### Variables
Every blueprint template has access to the default context variables:
```
author   # the git author { name, email }
args     # array of arguments passed
name     # the first required argument
src      # the source blueprint directory
dest     # the destination (project root)
path     # relative path from dest
```
In addition to any variables in `config.json`.

### Helpers
There are several built-in Handlebars [helpers](./lib/helpers/handlebars.js).
You can also register more in the before hook.

### Hooks
If you want to add your own custom behavior, you can hook into blueprint to add
your own behavior. Simply add whatever hooks you want to your template's
`blueprint.js`.

The following hooks are available: `before` and `after`.

#### exports.before(blueprint)
The before hook gets run before the templates files are generated.

A good place to add extra variables to the context, register handlebars helpers
and so on.

#### exports.after(blueprint)
This gets run after the template files are generated successfully.

#### The blueprint object
The blueprint object has the following properties:
```
context       # Handlebars context variables
handlebars    # Handlebars object
helpers       # blueprints built-in helpers
ignore        # alias for metalsmith.ignore
options       # any command-line options
use           # alias for metalsmith.use
```

[handlebars]: http://handlebarsjs.com/
[metalsmith]: https://github.com/segmentio/metalsmith
[prettier]: https://github.com/prettier/prettier
[standard]: http://standardjs.com/
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
