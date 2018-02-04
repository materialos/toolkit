/*
	Module dependencies
*/
const fs = require("pn/fs");
const dirToJson = require("dir-to-json");


module.exports = {
	getJson(path = "./") {
		return new Promise(function(resolve, reject) {
			dirToJson(path)
				.then(resolve)
				.catch(error => reject(error));
		});
	},


	saveJson(path, outputPath = "output.json") {
		return new Promise((resolve, reject) => {
			this.getJson(path)
				.then(data => fs.writeFile(outputPath, JSON.stringify(data, null, "\t")))
				.then(resolve)
				.catch(error => reject(error));
		});
	}
};
