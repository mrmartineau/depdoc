# Autodoc
> Auto-generate documentation using your package.json's dependencies

Autodoc simply scans your `package.json`'s `dependencies` property and returns some simple information about each item. For an example, please see this package's own [auodoc.md](https://github.com/mrmartineau/autodoc/blob/master/autodoc).

## Install

```sh
npm install --global autodoc
```

## CLI

```sh
Usage: autodoc <filepath> [options]

Options:

  -h, --help      output usage information
  -V, --version   output the version number
  -g, --generate  Generate a markdown file of the result
  -p, --print     Print result to the console
  -c, --copy      Copy result to clipboard
```

Example usage:

### Print result to the console
```sh
autodoc <filepath> -p

autodoc package.json -p
autodoc https://raw.githubusercontent.com/TryKickoff/generator-kickoff/master/package.json -p
```

### Copy result to your clipboard
```sh
autodoc <filepath> -c

autodoc package.json -c
autodoc https://raw.githubusercontent.com/TryKickoff/generator-kickoff/master/package.json -c
```

### Create markdown file of result
Default filename is `autodoc.md`
```sh
autodoc <filepath> -g

autodoc package.json -g dependencies
autodoc https://raw.githubusercontent.com/TryKickoff/generator-kickoff/master/package.json -g dependencies
```

## Usage (unfinished)

```js
var autodoc = require('autodoc');
var package = require('./package');

console.log(autodoc(package));
```
