#! /usr/bin/env node
var depdoc = require('./');
var program = require('commander');
var version = require('./package').version
var copyPaste = require('copy-paste');
var fs = require('fs');

var userArgs = process.argv.slice(2);

/**
 * TODO:
 * - show waiting animation
 */

program
	.version(version)
	//.option('-f, --file [file]', 'The file you are parsing', 'package.json')
	.option('-g, --generate [name]', 'Generate a markdown file of the result', 'depdoc')
	.option('-p, --print', 'Print result to the console')
	.option('-c, --copy', 'Copy result to clipboard')
	.parse(process.argv);


// Display help if no args are provided
if (userArgs.length < 1) {
	program.help();
	return;
}

var result;

// If there is no argv, try to use a package.json in the same directory
if (userArgs[0].indexOf('package.json') === -1) {
	result = depdoc('package.json');
} else {
	// depdoc(program.file); // or
	result = depdoc(userArgs[0]);
}

// Results
if (userArgs.indexOf('-g') !== -1) {
	fs.writeFileSync(program.generate +'.md', result);
	process.stdout.write('Success! '+ program.generate +'.md has been created for you');
}

if (program.print) {
	process.stdout.write(result);
}

if (program.copy) {
	copyPaste.copy(result);
	process.stdout.write('Success! depdoc has copied the results to your clipboard');
}
