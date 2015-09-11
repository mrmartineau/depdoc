/**
 * Autodocs
 * @author: Zander Martineau
 *
 * USAGE:
 * autodoc package.json ✔
 * autodoc https://raw.githubusercontent.com/TryKickoff/kickoff/master/package.json ✔
 *
 * TODO:
 * - Create an online version that takes json pasted in a textarea
 * - If zero dependencies, tell the user about it
 * - Error handling:
 *   - if the registry is down
 *   - if the path/filename is incorrect/doesn't exist
 */

var fs = require('fs');
var _ = require('lodash');
var registryUrl = require('registry-url')();
var request = require('sync-request');

function autodocs(packageURL) {
	var result;

	if (packageURL.indexOf('github') > 0) {
		var newPackageUrl = packageURL.replace('raw.githubusercontent.com', 'rawgit.com');
		var res = request('GET', newPackageUrl);
		var data = res.getBody('utf-8').toString();
		result = getPackageInformation(data);
	} else {
		var readFile = fs.readFileSync(packageURL);
		result = getPackageInformation(readFile);
	}

	return result;
}


/**
 * Get package.json contents
 */
function getPackageInformation(data) {
	var deps = JSON.parse(data).dependencies;
	var result = '';

	_.forEach(deps,
		function(value, key){

			var res = request('GET', registryUrl + key);
			var data = res.getBody('utf-8').toString();

			var packageInfo = JSON.parse(data);
			var name        = packageInfo.name;
			var description = packageInfo.description;
			var homepage    = packageInfo.homepage;
			var issues      = packageInfo.bugs.url;
			var repo        = packageInfo.repository;
			var license     = packageInfo.license;

			result += '## ['+ name +']('+ homepage +')' +
			'\n'+ description +
			'\n\n[npm](http://npmjs.org/'+ key +') - [Homepage]('+ homepage +') - [Repository]('+ repo.url +') ('+ repo.type +') - [Issues]('+ issues +') - Licence: '+ license +
			'\n\nInstall with `npm install '+ name +'`' +
			'\n---\n';
		});
	return result;
}

module.exports = autodocs;
