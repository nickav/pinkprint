const path = require('path');
const fs = require('fs');
const util = require('util');

const chalk = require('chalk');

const { assert, findProjectRoot, getGitUser } = require('./helpers');

exports.findProjectRoot = findProjectRoot;

const getPinkprintsDir = (projectRoot) =>
  path.resolve(projectRoot, 'pinkprints');

const getPinkprintsConfig = (projectRoot) =>
  path.resolve(projectRoot, 'pinkprint.config.js');

const loadConfig = (exports.loadConfig = (projectRoot) => {
  const configFile = getPinkprintsConfig(projectRoot);

  if (!fs.existsSync(configFile)) {
    return null;
  }

  let config = null;
  try {
    config = require(configFile);
  } catch (err) {
    return {};
  }

  return config;
});

const createFs = (basePath) => {
  const self = {
    basePath,

    defaultExtension: '',

    writeFile: (dest, contents) => {
      return util
        .promisify(fs.mkdir)(path.dirname(dest), { recursive: true })
        .then(() => {
          const filePath = path.join(self.basePath, dest);
          const ext = self.defaultExtension.startsWith('.')
            ? self.defaultExtension
            : '.' + self.defaultExtension;
          const file = path.basename(filePath).includes('.')
            ? filePath
            : filePath + ext;

          return util.promisify(fs.writeFile)(file, contents);
        });
    },
  };

  return self;
};

const createContext = (exports.createContext = () => {
  const projectRoot = findProjectRoot() || process.cwd();
  const config = (loadConfig(projectRoot) || {}).default;

  return {
    projectRoot,
    config,
  };
});

const assertNoConfigErrors = (projectRoot, config) => {
  const configFile = getPinkprintsConfig(projectRoot);

  assert(
    config,
    chalk.red(`Missing pinkprint.config.js file!`) +
      `\n  Expected ${configFile}`
  );

  assert(
    config.default,
    chalk.red(`Invalid config file!`) +
      '\n  Config file must have a default export!'
  );
};

const runInit = (exports.runInit = (ctx, argv) => {
  const configFile = getPinkprintsConfig(ctx.projectRoot);

  assert(!fs.existsSync(configFile), 'Config file already exists.');

  const contents = `
exports.default = {
  commands: {
  }
}`;

  fs.writeFileSync(configFile, contents.trim());
  console.log(chalk.green(`pinkprint.config.js created successfully!`));
});

const runNew = (exports.runNew = (ctx, argv) => {
  const dir = getPinkprintsDir(ctx.projectRoot);

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
  assertNoConfigErrors(ctx.projectRoot, loadConfig(ctx.projectRoot));

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
  assertNoConfigErrors(ctx.projectRoot, loadConfig(ctx.projectRoot));

  const run = typeof cmd === 'function' ? cmd : cmd.run;
  assert(typeof run === 'function', 'Command must be a function!');

  const outputDir = argv.outputDir
    ? path.resolve(process.cwd(), argv.outputDir)
    : '';
  const configOutputPath = (ctx.config.output || {}).path || '';
  const configDir = configOutputPath
    ? path.resolve(ctx.projectRoot, configOutputPath)
    : '';

  const context = {
    ...ctx,
    name,
    author: getGitUser(),
    fs: createFs(outputDir || configDir || ctx.projectRoot),
  };

  let result = null;
  try {
    result = run(context, argv);
  } catch (e) {
    console.log(chalk.red(`Command ${name} threw an error:`));
    console.log(e);
  }

  console.log(result);
});

const runGenerate = (exports.runGenerate = (ctx, argv) => {
  assertNoConfigErrors(ctx.projectRoot, loadConfig(ctx.projectRoot));

  const { command: commandName, name } = argv;
  const commands = ctx.config.commands || {};
  const command = commands[commandName];

  assert(
    command,
    chalk.red(`Unknown command: '${commandName}'`) +
      `\n  Available commands: ${Object.keys(commands).join(', ')}`
  );

  generate(ctx, argv, name, command);
});
