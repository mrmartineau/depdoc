#! /usr/bin/env node
var autodoc = require('./');
var program = require('commander');
var version = require('./package').version
var copyPaste = require('copy-paste');
var fs = require('fs');

var userArgs = process.argv.slice(2);

/**
 * TODO:
 * - Defaults:
 *   - print to console
 *   - if there's no argument, try to use a package.json from the cwd. ✔ (is this needed?)
 * - show waiting animation
 */

program
	.version(version)
	.option('-f, --file', 'The file you are parsing', 'package.json')
	.option('-g, --generate', 'Generate a markdown file of the result')
	.option('-p, --print', 'Print result to the console')
	.option('-c, --copy', 'Copy result to clipboard')
	.parse(process.argv);

var result;

// If there is no argv, try to use a package.json in the same directory
if (userArgs[0].indexOf('package.json') === -1) {
	// console.log('no argv');
	result = autodoc('package.json');
} else {
	// autodoc(program.file); // or
	result = autodoc(userArgs[0]);
}


if (program.generate) {
	fs.writeFileSync('autodoc.md', result);
}

if (program.print) {
	console.log(result);
}

if (program.copy) {
	copyPaste.copy(result);
}
