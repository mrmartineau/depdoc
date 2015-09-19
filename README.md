# depdoc
> Auto-generate documentation using your package.json's dependencies

depdoc simply scans your `package.json`'s `dependencies` property and returns some simple information about each item. For an example, please see this package's own [depdoc.md](https://github.com/mrmartineau/depdoc/blob/master/depdoc.md).

## Install

```sh
npm install --global depdoc
```

## CLI

```sh
Usage: depdoc <filepath> [options]

Options:

  -h, --help      output usage information
  -V, --version   output the version number
  -g, --generate  Generate a markdown file of the result
  -p, --print     Print result to the console
  -c, --copy      Copy result to clipboard
```

## CLI usage:

### Print result to the console
```sh
depdoc <filepath> -p

depdoc package.json -p
depdoc https://raw.githubusercontent.com/TryKickoff/generator-kickoff/master/package.json -p
```
Note: files hosted on github.com can also be used

### Copy result to your clipboard
```sh
depdoc <filepath> -c

depdoc package.json -c
depdoc https://raw.githubusercontent.com/TryKickoff/generator-kickoff/master/package.json -c
```

### Create markdown file of result
Default filename is `depdoc.md`
```sh
depdoc <filepath> -g

depdoc package.json -g dependencies
depdoc https://raw.githubusercontent.com/mrmartineau/depdoc/master/package.json -g dependencies
```

## Non-CLI usage
depdoc can also be used in your node code, but in order for your it to parse your json, you will need to normalise it first, see below for an example from the [depdoc demo site](http://depdoc.herokuapp.com/).

```js
var depdoc = require('depdoc');
var input = document.querySelector('.packageInput').value;
		var normalisedInput = input.replace(/\r?\n|\s|\r/g,'');

var result = depdoc(input, 'json');
```
