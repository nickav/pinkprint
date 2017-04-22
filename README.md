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
├── config.json          # config vars available in any template
├── blueprint.js         # hooks that allow you to add your own behavior
├── README.md            # how to use your template
├── generate/            # Webpack builds the static site into this directory
├── partials/            # Handlebars partials will be auto-registered
```

### Variables
Every blueprint has access to the default context variables:
```
{ author, args, name, src, dest, path }
```
In addition to any variables in `config.json`.

### Hooks
If you want to add your own custom behavior, you can hook into blueprint to add
your own behavior. Simply add whatever hooks you want to your template's
`blueprint.js`.

The following hooks are available: `before` and `after`.

#### exports.before(context, blueprint)
The before hook gets run before the templates files are generated. This is a
good place to add extra variables to the context, register handlebars helpers
and so on.

#### exports.after(context, blueprint)
This gets run after the template files are generated successfully.

#### The blueprint object
The blueprint object has the following properties:
```
  use: metalsmith.use,
  ignore: metalsmith.ignore,
  handlebars: Handlebars,
  helpers,
  options
```

[handlebars]: http://handlebarsjs.com/
[metalsmith]: https://github.com/segmentio/metalsmith
[prettier]: https://github.com/prettier/prettier
[standard]: http://standardjs.com/
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
