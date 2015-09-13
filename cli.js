#! /usr/bin/env node
var depdoc = require('./');
var program = require('commander');
var version = require('./package').version
var copyPaste = require('copy-paste');
var fs = require('fs');

var userArgs = process.argv.slice(2);

/**
 * TODO:
 * - Defaults:
 *   - print to console ✔
 *   - if there's no argument, try to use a package.json from the cwd. ✔ (is this needed?)
 * - show waiting animation
 * - add success messages for different options ✔
 */

program
	.version(version)
	.option('-f, --file [file]', 'The file you are parsing', 'package.json')
	.option('-g, --generate [name]', 'Generate a markdown file of the result', 'depdoc')
	.option('-p, --print', 'Print result to the console')
	.option('-c, --copy', 'Copy result to clipboard')
	.parse(process.argv);

var result;

// If there is no argv, try to use a package.json in the same directory
if (userArgs[0].indexOf('package.json') === -1) {
	result = depdoc('package.json', 'file');
} else {
	// depdoc(program.file); // or
	result = depdoc(userArgs[0], 'file');
}


if (program.generate) {
	fs.writeFileSync(program.generate +'.md', result);
	console.log('Success! '+ program.generate +'.md has been created for you');
}

if (program.print) {
	console.log(result);
}

if (program.copy) {
	copyPaste.copy(result);
	console.log('Success! depdoc has copied the results to your clipboard');
}
