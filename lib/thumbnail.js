/*
	Module dependencies
*/
const fs = require("pn/fs");


/*
	Get JPEG thumbnail from Illustrator XMP data
	Example: thumbnail("./icons/Adobe/Adobe After Effects.ai", "./Adobe After Effects.jpg");
*/
module.exports= function(inputPath, outputPath = "./output.jpg") {
	return new Promise(function(resolve, reject) {
		const rstream = fs.createReadStream(inputPath);
		let data = "";
		rstream
			.on("data", function(chunk) {
				data += chunk.toString();
				// Look for the end XMP tag
				if (/<\/x:xmpmeta>/i.test(data)) {
					this.close();
					// Get the thumbnail
					const match = data.match(/<xmpGImg:image>(.+)*<\/xmpGImg:image>/i)[1];
					// Write with the carriage returns removed
					fs.writeFile(outputPath, match.replace(/&#xA;/g, ""), "base64")
						.then(resolve)
						.catch(error => reject(error));
				}
			})
			.on("end", function() {
				reject(new Error("Reached EOF without finding XMP data."));
			});
	});
};
