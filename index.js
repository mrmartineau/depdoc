/**
 * depdoc
 * @author: Zander Martineau
 *
 * USAGE:
 * depdoc package.json ✔
 * depdoc https://raw.githubusercontent.com/mrmartineau/depdoc/master/package.json ✔
 *
 * TODO:
 * - Error handling:
 *   - if the registry is down
 *   - if the path/filename is incorrect/doesn't exist
 */

var fs = require('fs');
var _ = require('lodash');
var registryUrl = require('registry-url')();
var request = require('sync-request');
var Mustache = require('mustache');
var repo = require('gepo');
var banner = '# Project dependencies\n\n';
var credit = 'Documentation created with [depdoc](https://github.com/mrmartineau/depdoc/)'


function depdoc(input) {
	var result;
	var input = arguments[0];
	var type = arguments[1] === undefined ? undefined : arguments[1];

	if (type === 'json') {
		result = getPackageInformation(input);

	} else if (input.indexOf('github') > 0) {
		var newPackageUrl = input.replace('raw.githubusercontent.com', 'rawgit.com');
		var res = request('GET', newPackageUrl);
		var data = res.getBody('utf-8').toString();
		result = getPackageInformation(JSON.parse(data));

	} else {
		var readFile = fs.readFileSync(input);
		result = getPackageInformation(JSON.parse(readFile));
	}

	return result;
}


/**
 * Get package.json contents
 */
function getPackageInformation(data) {
	var deps = data.dependencies;
	var result = '';

	if (_.isEmpty(deps)) {
		return 'This package has no dependencies :(';
	}

	_.forEach(deps, function(value, key){
		var newKey = key.replace('/', '%2F');
		var res = request('GET', registryUrl + newKey);
		var data = res.getBody('utf-8');

		var packageInfo = JSON.parse(data);
		var packageInfoData = {
			name: packageInfo.name,
			description: typeof packageInfo.description !== 'undefined' ? packageInfo.description : '',
			homepage: typeof packageInfo.homepage !== 'undefined' ? packageInfo.homepage : '',
			repo: typeof packageInfo.repository !== 'undefined' ? repo(packageInfo.repository.url) : '',
			issues: typeof packageInfo.bugs !== 'undefined' ? packageInfo.bugs.url : '',
			license: typeof packageInfo.license !== 'undefined' ? packageInfo.license : ''
		}

		var template = fs.readFileSync(__dirname + '/template.mst');
		result += Mustache.render(template.toString(), packageInfoData);
	});

	return banner + result + credit;
}

module.exports = depdoc;
