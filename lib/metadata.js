/*
	Module dependencies
*/
const {parseString} = require("xml2js");
const fs = require("fs");


module.exports = {
	// TODO: get, set, merge, and add in object; get and set the object to/from file
	// TODO: support for SVG
	get(path) {
		return new Promise(function(resolve, reject) {
			const rstream = fs.createReadStream(path);
			let data = "";
			rstream
				.on("data", function(chunk) {
					data += chunk.toString();
					// Look for the end XMP tag
					if (/<\/x:xmpmeta>/i.test(data)) {
						this.close();
						const meta = data.match(/<x:xmpmeta[\S\s]*<\/x:xmpmeta>/i)[0];
						parseString(meta, function(error, result) {
							if (error) {
								reject(error);
							} else {
								resolve(result);
							}
						});
					}
				})
				.on("end", function() {
					reject(new Error("Reached EOF without finding XMP data."));
				});
		});
	}
};
