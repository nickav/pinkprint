const path = require('path');
const fs = require('fs');

const matchAll = (str, regex) => {
    let match,
        output = [];
    while ((match = regex.exec(str))) {
        output.push(match);
    }
    return output;
};

exports.before = ({ context, helpers }) => {
    // parse svg icon
    const { argv } = context;
    const file = argv.name;

    if (!file) throw 'Please specify a js file to test';
    if (!file.endsWith('.js')) {
        throw `Expecting a path to a js file. Got ${file}`;
    }

    const filePath = path.resolve(process.cwd(), file);

    if (!fs.existsSync(filePath)) {
        throw `File doesn't exist: ${filePath}`;
    }

    context['path'] = file.replace(/^src/, '').replace(/\/[^\/]*$/, '');
    context['name'] = context.name.replace(/\.jsx?/, '');

    const js = fs.readFileSync(filePath).toString();
    const matches = matchAll(js, /export (var|let|const|function)\s(\w+)/g);
    context['exports'] = matches.map(match => match[2]);
};
