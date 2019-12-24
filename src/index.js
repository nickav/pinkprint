const path = require('path');
const fs = require('fs');
const util = require('util');

const chalk = require('chalk');

const { assert, findProjectRoot, getGitUser } = require('./helpers');
const templateHelpers = require('./template-helpers');

const catchAll = (fn, defaultResult) => {
  let result = defaultResult;
  try {
    result = fn();
  } catch (e) {}
  return result;
};

const requireSafe = (file, defaultValue = {}) => {
  if (!fs.existsSync(file) && !fs.existsSync(file + '.js')) {
    return null;
  }

  try {
    return require(file);
  } catch (err) {
    return defaultValue;
  }
};

const startWith = (str, prefix) =>
  str.startsWith(prefix) ? str : prefix + str;

const getPinkprintsDir = (projectRoot) =>
  path.resolve(projectRoot, 'pinkprints');

const getPinkprintsConfig = (projectRoot) =>
  path.resolve(projectRoot, 'pinkprint.config.js');

const createContext = (exports.createContext = () => {
  const projectRoot = findProjectRoot() || process.cwd();
  const templateDir = getPinkprintsDir(projectRoot);
  const configFile = getPinkprintsConfig(projectRoot);
  const config = (requireSafe(configFile) || {}).default || {};

  return {
    projectRoot,
    templateDir,
    configFile,
    config,
  };
});

const createFs = (ctx, argv, basePath) => {
  const self = {
    basePath,

    defaultExtension: '',

    setDefaultExtension: (ext) => (self.defaultExtension = ext),

    withExtension: (name, ext) =>
      path.basename(name).includes('.') ? name : name + startWith(ext, '.'),

    resolvePath: (dest) => {
      const filePath = path.resolve(self.basePath, dest);
      return self.defaultExtension
        ? self.withExtension(filePath, self.defaultExtension)
        : filePath;
    },

    write: (dest, contents) => {
      const file = self.resolvePath(dest);

      return Promise.resolve(
        argv.preview
          ? console.log(contents)
          : self
              .mkdirp(path.dirname(file))
              .then(() => self.writeFile(file, contents))
      ).then(() => {
        const relFile = path.relative(ctx.projectRoot, file);
        console.log(chalk.cyan(`Wrote file ${relFile}`));
      });
    },

    writeFile: (...args) => util.promisify(fs.writeFile)(...args),

    mkdirp: (dir) => util.promisify(fs.mkdir)(dir, { recursive: true }),

    readFileSync: (filePath) => catchAll(fs.readFileSync(filePath, 'utf8'), ''),

    readDirSync: (dir, options) => catchAll(fs.readdirSync(dir, options), []),
  };

  return self;
};

const assertNoConfigErrors = (configFile, config) => {
  assert(
    config,
    () =>
      chalk.red(`Missing pinkprint.config.js file!`) +
      `\n  Expected ${configFile}`
  );

  assert(
    config.default,
    () =>
      chalk.red(`Invalid config file!`) +
      '\n  Config file must have a default export!'
  );
};

const runInit = (exports.runInit = (ctx, argv) => {
  assert(!fs.existsSync(ctx.configFile), 'Config file already exists.');

  const contents = `
exports.default = {
  commands: {
  }
}`;

  fs.writeFileSync(configFile, contents.trim());
  console.log(chalk.green(`pinkprint.config.js created successfully!`));
});

const runNew = (exports.runNew = (ctx, argv) => {
  const dir = ctx.templateDir;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const name = argv.name.endsWith('.js') ? argv.name : argv.name + '.js';
  const newFile = path.resolve(dir, name);
  const contents = `exports.default = (ctx) => \`\`;`;

  fs.writeFileSync(newFile, contents);
  const relativeName = path.relative(process.cwd(), newFile);
  console.log(chalk.green(`${relativeName} created successfully!`));
});

const runList = (exports.runList = (ctx, argv) => {
  assertNoConfigErrors(ctx.configFile, requireSafe(ctx.configFile));

  const commands = ctx.config.commands || {};

  assert(Object.keys(commands).length, 'No commands found');

  console.log(chalk.magenta('Commands:'));
  console.log(
    Object.keys(commands)
      .map((e) => `  ${chalk.magenta(e)}`)
      .join('\n')
  );
});

const generate = (exports.generate = (ctx, argv, name, cmd) => {
  assertNoConfigErrors(ctx.configFile, requireSafe(ctx.configFile));

  const run = typeof cmd === 'function' ? cmd : cmd.run;
  assert(typeof run === 'function', 'Command must be a function!');

  const outputDir = argv.outputDir
    ? path.resolve(process.cwd(), argv.outputDir)
    : '';
  const configOutputPath = (ctx.config.output || {}).path || '';
  const configDir = configOutputPath
    ? path.resolve(ctx.projectRoot, configOutputPath)
    : '';

  const fsRoot = outputDir || configDir || ctx.projectRoot;

  const context = {
    ...ctx,
    name,
    getAuthor: () => context.getPackageJson().author || getGitUser().name || '',
    getGitUser,
    getPackageJson: () =>
      requireSafe(path.resolve(ctx.projectRoot, 'package.json'), {}),
    getTemplate: (name) => {
      const templatePath = name.includes('pinkprints/')
        ? path.resolve(ctx.projectRoot, name)
        : path.resolve(ctx.templateDir, name);

      const template = requireSafe(templatePath, null);

      assert(
        template,
        () =>
          chalk.red(`Missing template file: ${name}`) +
          `\n  Searched ${templatePath}`
      );

      return template.default;
    },
    require: requireSafe,
    helpers: templateHelpers,
    fs: createFs(ctx, argv, fsRoot),
  };

  let result = null;
  try {
    result = run(context, argv);
  } catch (e) {
    console.log(chalk.red(`Command ${name} threw an error:`));
    console.log(e);
  }
});

const runGenerate = (exports.runGenerate = (ctx, argv) => {
  assertNoConfigErrors(ctx.configFile, requireSafe(ctx.configFile));

  const { command: commandName, name } = argv;
  const commands = ctx.config.commands || {};
  const command = commands[commandName];

  assert(
    command,
    () =>
      chalk.red(`Unknown command: '${commandName}'`) +
      `\n  Available commands: ${Object.keys(commands).join(', ')}`
  );

  generate(ctx, argv, name, command);
});
