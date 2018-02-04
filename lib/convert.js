/*
	Module dependencies
*/
const {spawn} = require("pn/child_process");


/*
	Convert AI files (or anything Inkscape supports) to plain SVG

	Issues:
		Inkscape must be installed and in your path (or `inkscapePath`)
		Masks don't correctly render in anything but Inkscape - http://www.inkscapeforum.com/viewtopic.php?t=30964
			This causes the rasterized drop shadows to not appear, but they're there
		Inkscape changes the viewbox, width, and height of the SVG seemingly without a setting to override this
*/
module.exports = function(
	inputPath,
	outputPath = "./output.svg",
	args = [
		`--file=${inputPath}`,
		`--export-plain-svg=${outputPath}`
	],
	inkscapePath = "inkscape"
) {
	return new Promise(function(resolve, reject) {
		const process = spawn(inkscapePath, args);

		process.on("close", code => {
			code ? reject() : resolve();
		});
	});
};
