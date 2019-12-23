const path = require('path');
const fs = require('fs');

const chalk = require('chalk');

const { assert, findProjectRoot } = require('./helpers');

exports.findProjectRoot = findProjectRoot;

const getPinkprintsDir = (root) => path.resolve(root, 'pinkprints');

const getPinkprintsConfig = (root) => path.resolve(root, 'pinkprint.config.js');

const loadConfig = (exports.loadConfig = (root) => {
  const configFile = getPinkprintsConfig(root);

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

const assertNoConfigErrors = (root, config) => {
  const configFile = getPinkprintsConfig(root);

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

const runNew = (exports.runNew = (ctx, argv) => {
  const dir = getPinkprintsDir(ctx.root);

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
  assertNoConfigErrors(ctx.root, loadConfig(ctx.root));

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
  const run = typeof cmd === 'function' ? cmd : cmd.run;
  assert(typeof run === 'function', 'Command must be a function!');

  let result = null;
  try {
    result = run(ctx);
  } catch (e) {
    console.log(chalk.red(`Command ${name} threw an error:`));
    console.log(e);
  }

  console.log(result);
});

const runGenerate = (exports.runGenerate = (ctx, argv) => {
  assertNoConfigErrors(ctx.root, loadConfig(ctx.root));

  const { template, name } = argv;
  const commands = ctx.config.commands || {};
  const command = commands[template];

  assert(
    command,
    chalk.red(`Unknown command: '${template}'`) +
      `\n  Available commands: ${Object.keys(commands).join(', ')}`
  );

  generate(ctx, argv, template, command);
});
