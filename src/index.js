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

  let userConfig = null;
  try {
    userConfig = require(configFile);
  } catch (err) {
    return {};
  }

  return userConfig;
});

const assertNoConfigErrors = (root, config) => {
  const configFile = getPinkprintsConfig(root);

  assert(
    config,
    chalk.red(`Missing pinkprint.config.js file!`) +
      `\n  Expected ${configFile}`
  );

  assert(
    userConfig.default,
    chalk.red(`Invalid config file!`) +
      '\n  Config file must have a default export!'
  );
};

const runNew = (exports.runNew = (argv) => {
  const dir = getPinkprintsDir(root);

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

const runList = (exports.runList = (argv) => {
  const commands = userConfig.commands || {};

  assert(Object.keys(commands).length, 'No commands found');

  console.log(chalk.magenta('Commands:'));
  console.log(
    Object.keys(commands)
      .map((e) => `  ${e}`)
      .join('\n')
  );
});

const runGenerate = (exports.runGenerate = (argv) => {
  console.log('not implemented');
});
