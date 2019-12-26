const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const startWith = (str, prefix) =>
  str.startsWith(prefix) ? str : prefix + str;

const createFs = (exports.createFs = (
  mount,
  options = { relativePath: '', noWrite: false }
) => {
  const self = {
    mount,

    defaultExtension: '',

    ...options,

    setDefaultExtension: (ext) => (self.defaultExtension = ext),

    withExtension: (name, ext) =>
      path.basename(name).includes('.') ? name : name + startWith(ext, '.'),

    resolvePath: (dest) => {
      const filePath = path.resolve(self.mount, dest);
      return self.defaultExtension
        ? self.withExtension(filePath, self.defaultExtension)
        : filePath;
    },

    write: (dest, contents) => {
      const file = self.resolvePath(dest);
      const relFile = path.relative(self.relativePath || self.mount, file);

      return Promise.resolve(
        self
          .mkdirp(path.dirname(file))
          .then(() => self.writeFile(file, contents))
      )
        .then(() => {
          console.log(
            self.noWrite
              ? chalk.yellow(`Skipped writing ${relFile}`)
              : chalk.cyan(`Wrote file ${relFile}`)
          );

          self.noWrite && console.log(contents);
        })
        .catch((err) => {
          console.error(chalk.red(`Failed to create ${relFile}`));
          console.error(err);
        });
    },

    writeFile: (...args) =>
      self.noWrite
        ? Promise.resolve(true)
        : util.promisify(fs.writeFile)(...args),

    mkdirp: (dir) =>
      self.noWrite
        ? Promise.resolve(true)
        : util.promisify(fs.mkdir)(dir, { recursive: true }),

    readFileSync: (filePath) => catchAll(fs.readFileSync(filePath, 'utf8'), ''),

    readDirSync: (dir, options) => catchAll(fs.readdirSync(dir, options), []),
  };

  return self;
});
