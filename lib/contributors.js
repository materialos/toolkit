/*
	Module dependencies
*/
const fs = require("pn/fs");

// all-contributors-cli
const add = require("all-contributors-cli/dist/contributors/add");
const generate = require("all-contributors-cli/dist/generate");


module.exports = {
	/*
		Relay to all-contributors-cli
	*/
	generate,
	add,


	// TODO: git commit icons as author(s)


	/*
		Sort contributors alphabetically
	*/
	sort(path = ".all-contributorsrc") {
		return new Promise(function(resolve, reject) {
			fs.readFile(path)
				.then(data => {
					// Parse
					data = JSON.parse(data);
					// Sort contributors by name key
					data.contributors.sort((a, b) => {
						const nameA = a.name.toLowerCase();
						const nameB = b.name.toLowerCase();

						if (nameA < nameB) {
							return -1;
						}

						if (nameA > nameB) {
							return 1;
						}

						return 0;
					});

					// Create output exactly as all-contributors-cli does to reduce diffing
					const output = `${JSON.stringify(data, null, 2)}\n`;
					// Save and resolve
					fs.writeFile(path, output)
						.then(resolve)
						.catch(error => reject(error));
				})
				.catch(error => reject(error));
		});
	}
};
