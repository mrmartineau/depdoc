/**
 * Autodoc
 * @author: Zander Martineau
 *
 * TODO:
 * - take a package.json as input
 *   - could give a Github or Bitbucket repo url instead
 * - find dependencies prop & parse
 * - loop through each one & grab some info about each
 *   - Name
 *   - NPM/Github URL
 *   - Description
 *   - Demo
 * - Generate a new markdown file with this information so that it can be copied into a readme
 */

var fs = require('fs');
var npm = require('npm');
var _ = require('lodash');
// var ajax = require('qwest');




function autodoc(packageURL) {
	// console.log(packageURL);
	/**
	 * Get package.json contents with AJAX if its located online
	 */
	fs.readFile(packageURL, function (err, data) {
		if (err) throw err;
		var deps = JSON.parse(data).dependencies;
		console.log('deps', deps);

		_.forIn(deps, function(value, key) {
			console.log('keyValue', key+ '@' +value);

			npm.load(function (err) {
				var item = npm.commands.view([key]);
				console.log(item);
			});
		});
	});
}

autodoc(process.argv[2]);