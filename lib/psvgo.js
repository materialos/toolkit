/*
	Module dependencies
*/
const svg2js = require("svgo/lib/svgo/svg2js.js");
const js2svg = require("svgo/lib/svgo/js2svg.js");


// util.promisify works, but the first arg sent to the callback is not an error
const trymisify = function(func, ...args) {
	return new Promise((resolve, reject) => {
		try {
			func(...args, resolve);
		} catch (error) {
			reject(error);
		}
	});
};


module.exports = {
	svg2js(data) {
		return trymisify(svg2js, data);
	},
	js2svg(data) {
		return trymisify(js2svg, data);
	}
};
