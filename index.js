/**
 * depdoc
 * @author: Zander Martineau
 *
 * USAGE:
 * depdoc package.json ✔
 * depdoc https://raw.githubusercontent.com/mrmartineau/depdoc/master/package.json ✔
 *
 * TODO:
 * - Create an online version that takes json pasted in a textarea
 * - If zero dependencies, tell the user about it
 * - Error handling:
 *   - if the registry is down
 *   - if the path/filename is incorrect/doesn't exist
 *   - if the package has no dependencies ✔
 */

var fs = require('fs');
var _ = require('lodash');
var registryUrl = require('registry-url')();
var request = require('sync-request');
var Mustache = require('mustache');


function depdoc(input, type) {
	var result;

	if (type === 'json') {
		result = getPackageInformation(input);

	} else if (input.indexOf('github') > 0) {
		var newPackageUrl = input.replace('raw.githubusercontent.com', 'rawgit.com');
		var res = request('GET', newPackageUrl);
		var data = res.getBody('utf-8').toString2();
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

		var res = request('GET', registryUrl + key);
		var data = res.getBody('utf-8').toString();

		var packageInfo = JSON.parse(data);
		var packageInfoData = {
			name: packageInfo.name,
			description: typeof packageInfo.description !== 'undefined' ? packageInfo.description : '',
			homepage: typeof packageInfo.homepage !== 'undefined' ? packageInfo.homepage : '',
			issues: typeof packageInfo.bugs !== 'undefined' ? packageInfo.bugs.url : '',
			repo: typeof packageInfo.repository !== 'undefined' ? packageInfo.repository : '',
			license: typeof packageInfo.license !== 'undefined' ? packageInfo.license : ''
		}

		// TODO: Improve this:
		result += Mustache.render("## [{{name}}]({{{homepage}}})\n{{description}}\n\n[npm](http://npmjs.org/{{name}}){{#homepage}} - [Homepage]({{{homepage}}}){{/homepage}}{{#repo}} - [Repository]({{{repo.url}}}) ({{repo.type}}){{/repo}}{{#issues}} - [Issues]({{{issues}}}){{/issues}} - Licence: {{license}}\n\nInstall with `npm install {{name}}`\n---\n", packageInfoData);
		// console.log(result);
	});

	return result;
}

module.exports = depdoc;
