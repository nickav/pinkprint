const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const {
  assert,
  getGitUser,
  getGitRoot,
  catchAll,
  requireSafe,
} = require('./helpers');
const { createFs } = require('./fs');
const { findNearestFileSync, parents } = require('./file-utils');
const templateHelpers = require('./template-helpers');

const findProjectRoot = () => {
  const cwd = process.cwd();
  const packageJson = findNearestFileSync('package.json', cwd);
  return packageJson ? path.dirname(packageJson) : getGitRoot();
};

const CONFIG_FILE = 'pinkprint.config.js';

const getPinkprintsDir = (fromDir) => path.resolve(fromDir, 'pinkprints');

const findPinkprintsConfig = (fromDir) => {
  return findNearestFileSync(CONFIG_FILE, fromDir);
};

const createContext = (exports.createContext = () => {
  const projectRoot = findProjectRoot() || process.cwd();
  const configFile = findPinkprintsConfig(process.cwd());
  const templateDir = configFile && getPinkprintsDir(path.dirname(configFile));
  const config = (requireSafe(configFile) || {}).default || {};

  return {
    projectRoot,
    templateDir,
    configFile,
    config,
  };
});

const getFsRoot = (ctx, argv) => {
  const outputDir = argv.outputDir
    ? path.resolve(process.cwd(), argv.outputDir)
    : '';
  const configOutputPath = (ctx.config.output || {}).path || '';
  const configDir = configOutputPath
    ? path.resolve(ctx.projectRoot, configOutputPath)
    : '';

  return outputDir || configDir || ctx.projectRoot;
};

const getDefaultFsOptions = (ctx, argv) => ({
  relativePath: ctx.projectRoot,
  noWrite: argv.preview,
});

const assertNoConfigErrors = (configFile) => {
  assert(
    configFile,
    () =>
      chalk.red(`Missing ${CONFIG_FILE} file!\n`) +
      'Searched:\n' +
      parents(process.cwd())
        .map((e) => `  ${e}`)
        .join('\n')
  );

  const config = requireSafe(configFile) || {};

  assert(
    config.default,
    () =>
      chalk.red(`Invalid config file!`) +
      '\n  Config file must have a default export!'
  );
};

const runInit = (exports.runInit = (ctx, argv) => {
  const projectConfigFile = path.join(ctx.projectRoot, CONFIG_FILE);
  assert(
    !fs.existsSync(projectConfigFile),
    `Config file already exists.\n  Found: ${projectConfigFile}`
  );

  const contents = `
exports.default = {
  commands: {
  }
}`;

  fs.writeFileSync(projectConfigFile, contents.trim());
  console.log(
    chalk.green(`${CONFIG_FILE} created successfully!`) +
      `\n  Wrote ${projectConfigFile}`
  );
});

const runNew = (exports.runNew = (ctx, argv) => {
  const fs = createFs(ctx.templateDir, getDefaultFsOptions(ctx, argv));

  const name = argv.name.endsWith('.js') ? argv.name : argv.name + '.js';
  const contents = `exports.default = {
  generate: (args, h, argv, ctx) => \`Hello, $\{args.name}!\`,

  //name: (name, h) => \`\`,
  //extension: '.js',
  //pre: (args, h, argv, ctx) => {},
  //post: (args, h, argv, ctx) => {},
};`;

  fs.write(name, contents).then(() => {
    console.log(
      chalk.green(`${argv.name} template created successfully!`) +
        `\n  Consider adding a new command to your config file`
    );
  });
});

const runList = (exports.runList = (ctx, argv) => {
  assertNoConfigErrors(ctx.configFile);

  const commands = ctx.config.commands || {};

  assert(Object.keys(commands).length, 'No commands found');

  console.log('Commands:');
  console.log(
    Object.keys(commands)
      .map((e) => `  ${chalk.magenta(e)}`)
      .join('\n')
  );
});

const normalizePath = (filePath) => filePath.replace(/[\/\\\.]/g, path.sep);

const extractPathAndName = (fullPath) => {
  const parts = fullPath.split(path.sep);
  const name = parts.pop();
  return [parts.join(path.sep), name];
};

const createCommandContext = (ctx, argv) => {
  const [pathName, name] = extractPathAndName(normalizePath(argv.name));

  const fs = createFs(getFsRoot(ctx, argv), getDefaultFsOptions(ctx, argv));

  const getPackageJson = () =>
    requireSafe(path.resolve(ctx.projectRoot, 'package.json')) || {};

  const getAuthor = () => getPackageJson().author || getGitUser().name || '';

  const defaultPrintTemplate = {
    basePath: '.',
    name: (name) => name,
    extension: '.js',
  };

  const getTemplate = (name, templateOverride, fromTemplate) => {
    const nameWithExt = `${name}.js`;

    const templatePath = path.resolve(ctx.templateDir, nameWithExt);

    const templateFile = (requireSafe(templatePath, null) || {}).default || {};

    const { pre, generate, post, ...from } = fromTemplate;

    const template = {
      ...defaultPrintTemplate,
      ...templateFile,
      ...from,
      ...templateOverride,
    };

    assert(template.generate, () =>
      chalk.red(`Template ${name} does not have a generate function`)
    );

    return template;
  };

  const getPrintArgs = (template) => {
    const name = template.name(self.name, templateHelpers);
    const fileName = name + template.extension;

    const relativeName = path.join(template.basePath, self.path, fileName);

    const fullPath = fs.resolvePath(relativeName);

    return {
      name,
      fileName,
      relativeName,
      fullPath,
      author: argv.author || getAuthor(),
      template,
    };
  };

  // TODO make (pre -> generate -> post) atomic
  const _generate = async (
    writeFiles,
    templateName = argv.command,
    templateOverride = {},
    fromTemplate = {}
  ) => {
    const template = getTemplate(templateName, templateOverride, fromTemplate);
    const printArgs = getPrintArgs(template);

    const params = [printArgs, templateHelpers, argv, self];

    try {
      await (template.pre ? template.pre(...params) : Promise.resolve());

      const contents = template.generate(...params);
      if (writeFiles) await fs.write(printArgs.fullPath, contents);

      await (template.post ? template.post(...params) : Promise.resolve());

      return contents;
    } catch (e) {
      console.error(e);
    }
  };

  const string = (...params) => {
    return _generate(false, ...params);
  };

  const print = (...params) => {
    return _generate(true, ...params);
  };

  const self = {
    ...ctx,
    path: pathName,
    name,

    getPackageJson,
    getAuthor,
    getGitUser,
    getTemplate,

    print,
    string,

    assert,
    require: requireSafe,
    helpers: templateHelpers,

    fs,
  };

  return self;
};

const generate = (exports.generate = (ctx, argv, cmd) => {
  assertNoConfigErrors(ctx.configFile);

  const run = typeof cmd === 'function' ? cmd : cmd.run;
  assert(typeof run === 'function', 'Command must be a function!');

  const context = createCommandContext(ctx, argv);

  let result = null;
  try {
    result = run(context, argv);
  } catch (e) {
    console.log(chalk.red(`Command ${argv.name} threw an error:`));
    console.log(e);
  }

  return result;
});

const runGenerate = (exports.runGenerate = (ctx, argv) => {
  assertNoConfigErrors(ctx.configFile);

  const { command: commandName, name } = argv;
  const commands = ctx.config.commands || {};
  const command = commands[commandName];

  assert(
    command,
    () =>
      chalk.red(`Unknown command: '${commandName}'`) +
      `\n  Available commands: ${Object.keys(commands).join(', ')}`
  );

  generate(ctx, argv, command);
});
