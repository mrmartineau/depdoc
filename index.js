/**
 * Autodoc
 * @author: Zander Martineau
 *
 * USAGE:
 * autodoc package.json ✔
 * autodoc https://raw.githubusercontent.com/TryKickoff/kickoff/master/package.json
 *
 * TODO:
 * - take a package.json as input ✔
 *   - could give a Github or Bitbucket repo url instead
 * - find dependencies prop & parse ✔
 * - loop through each one & grab some info about each ✔
 *   - Name ✔
 *   - NPM/Github URL ✔
 *   - Description ✔
 *   - etc ✔
 * - Generate markdown with this information so that it can be copied into a readme
 *   - output in the console ✔
 *   - generate a new file
 *   - improve the output (e.g. highlighting)
 * - Create better CLI experience using commander.js
 *   - This should be placed in cli.js and requires this ✔
 * - Create an online version that takes json pasted in a textarea
 */

var fs = require('fs');
var _ = require('lodash');
var got = require('got');
var registryUrl = require('registry-url')();
var async = require('async');

function autodoc(packageURL) {
	if (packageURL.indexOf('github') > 0) {
		// console.log('package is from the net');
		var newPackageUrl = packageURL.replace('https://raw.githubusercontent.com', 'https://rawgit.com')
		// console.log('newPackageUrl', newPackageUrl);
		got(newPackageUrl, function (err, data, res) {
			// console.log('line 31', res.buffer);
			// TODO: investigate the buffer
			getPackageInformation(err, res.buffer);
		});

	} else {

		// console.log('File is on local system');
		fs.readFile(packageURL, function (err, data) {
			getPackageInformation(err, data);
		});

	}
}

/**
 * Get package.json contents
 */
function getPackageInformation(err, data) {
	if (err) throw err;
	// console.log('line 60', data);
	var deps = JSON.parse(data).dependencies;
	// console.log('deps', deps);
	var result = '';

	_.forEach(deps,
		function(value, key){
			// console.log('keyValue', key+ '@' +value);

			got(registryUrl + key, function (err, data, res) {
				// console.log(data);
				if (err) { return; }

				var packageInfo = JSON.parse(data);
				var name        = packageInfo.name;
				var description = packageInfo.description;
				var homepage    = packageInfo.homepage;
				var issues      = packageInfo.bugs.url;
				var repo        = packageInfo.repository;
				var license     = packageInfo.license;

				var newResult = '';
				newResult = '## ['+ name +']('+ homepage +')' +
				'\n'+ description +
				'\n\n[npm](http://npmjs.org/'+ key +') - [Homepage]('+ homepage +') - [Repository]('+ repo.url +') ('+ repo.type +') - [Issues]('+ issues +') - Licence: '+ license +
				'\nInstall with `npm install '+ name +'`' +
				'\n---\n';
				console.log(newResult);
				// result.push(newResult);
				// callback()
			});


		});

	// _.forEach(deps, function(value, key) {
	// 	// console.log('keyValue', key+ '@' +value);
	// 	got(registryUrl + key, function (err, data, res) {
	// 		// console.log(data);
	// 		if (err) { return; }

	// 		var packageInfo = JSON.parse(data);
	// 		var name        = packageInfo.name;
	// 		var description = packageInfo.description;
	// 		var homepage    = packageInfo.homepage;
	// 		var issues      = packageInfo.bugs.url;
	// 		var repo        = packageInfo.repository;
	// 		var license     = packageInfo.license;

	// 		var newResult = '';
	// 		newResult = '## ['+ name +']('+ homepage +')' +
	// 		'\n'+ description +
	// 		'\n\n[npm](http://npmjs.org/'+ key +') - [Homepage]('+ homepage +') - [Repository]('+ repo.url +') ('+ repo.type +') - [Issues]('+ issues +') - Licence: '+ license +
	// 		'\nInstall with `npm install '+ name +'`' +
	// 		'\n---\n';
	// 		console.log('foo',result);
	// 		result.push(newResult);
	// 	});

	// 	// got(registryUrl + key)
	// 	// 	.then(function (res) {
	// 	// 		var packageInfo = JSON.parse(res.body);
	// 	// 		var name        = packageInfo.name;
	// 	// 		var description = packageInfo.description;
	// 	// 		var homepage    = packageInfo.homepage;
	// 	// 		var issues      = packageInfo.bugs.url;
	// 	// 		var repo        = packageInfo.repository;
	// 	// 		var license     = packageInfo.license;


	// 	// 		var newResult = '';
	// 	// 		newResult = '## ['+ name +']('+ homepage +')' +
	// 	// 		'\n'+ description +
	// 	// 		'\n\n[npm](http://npmjs.org/'+ key +') - [Homepage]('+ homepage +') - [Repository]('+ repo.url +') ('+ repo.type +') - [Issues]('+ issues +') - Licence: '+ license +
	// 	// 		'\nInstall with `npm install '+ name +'`' +
	// 	// 		'\n---\n';

	// 	// 		result.push(newResult);

	// 	// 	})
	// 	// 	.catch(function (err) {
	// 	// 		console.error(err);
	// 	// 		console.error(err.response && err.response.body);
	// 	// 	});
	// });

	console.log('result line 115:', result);
	return result;
}

module.exports = autodoc;
