/*
	Module dependencies
*/
const fs = require("pn/fs");
const svg2png = require("svg2png");
const {convert} = require("convert-svg-to-png");


/*
	Promise for a file creation from the method of choice
*/
const methodConvert = function(method, [inputPath, outputPath = "./output.png", width, height]) {
	return new Promise(function(resolve, reject) {
		fs.readFile(inputPath)
			.then(buffer => method(buffer, {width, height}))
			.then(buffer => fs.writeFile(outputPath, buffer))
			.then(resolve)
			.catch(error => reject(error));
	});
};


module.exports= {
	/*
		Render PNG from SVG using PhantomJS (webkit)
	*/
	phantom() {
		return methodConvert(svg2png, arguments);
	},
	/*
		Render PNG from SVG using headless Chrome
	*/
	chrome() {
		return methodConvert(convert, arguments);
	},
};
