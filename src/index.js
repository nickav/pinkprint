const path = require('path');
const fs = require('fs');

const { assert, findProjectRoot } = require('./helpers');

const findProjectRootOrCwd = () => findProjectRoot() || process.cwd();

const getPinkprintsDir = (root) => path.resolve(root, 'pinkprints');

const getPinkprintsConfig = (root) => path.resolve(root, 'pinkprint.config.js');

const runNew = (exports.runNew = (argv) => {
  const root = findProjectRootOrCwd();
  const dir = getPinkprintsDir(root);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const name = argv.name.endsWith('.js') ? argv.name : argv.name + '.js';
  const newFile = path.resolve(dir, name);
  const contents = `exports.default = (ctx) => \`\`;`;

  fs.writeFileSync(newFile, contents);
  const relativeName = path.relative(process.cwd(), newFile);
  console.log(`${relativeName} created successfully!`);
});

const runList = (exports.runList = (argv) => {
  const root = findProjectRootOrCwd();
  const config = getPinkprintsConfig(root);

  assert(
    fs.existsSync(config),
    `Missing pinkprint.config.js file!\n  Expected ${config}`
  );

  let userConfig = null;
  try {
    userConfig = require(config);
  } catch (err) {
    console.log(`Failed to parse config file!`);
  }

  assert(userConfig.default, 'Config file must have a default export!');
  userConfig = userConfig.default;

  const commands = userConfig.commands || [];

  console.log('Commands:');
  console.log(commands);
});

const runGenerate = (exports.runGenerate = (argv) => {
  console.log('not implemented');
});
