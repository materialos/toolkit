#!/usr/bin/env node


/*
	Module dependencies
*/
const vorpal = require("vorpal")();
// const chalk = require("chalk");
const _ = require("lodash");
const util = require("util");
const {spawn} = require("child_process");
const path = require("path");

// Sub-modules
const contributors = require("../lib/contributors.js");
const render = require("../lib/render.js");
const metadata = require("../lib/metadata.js");
const thumbnail = require("../lib/thumbnail.js");
const convert = require("../lib/convert.js");
const dir = require("../lib/dir.js");


/*
	Vorpal
*/
/*
	Sort all-contributors file
*/
(vorpal
	.command("contributors sort [path]", "Sort .all-contributorsrc alphabetically.")
	.action(function(args, callback) {
		const {path} = args;
		contributors.sort(path)
			.then(() => {
				this.log(`Sorted ${path}`);
				callback();
			})
			.catch(error => {
				throw new Error(`Couldn't sort contributors.\n\n${error}`);
			});
	})
);


/*
	Callthrough to original contributors CLI
*/
const contribCli = function(command, args = []) {
	return new Promise(function(resolve, reject) {
		const process = spawn(
			"node",
			[
				path.join(__dirname, "..", "node_modules", "all-contributors-cli", "dist", "cli"),
				command,
				...args
			],
			{
				"stdio": "inherit"
			}
		);

		process.on("close", code => {
			code ? reject() : resolve();
		});
	});
};
(vorpal
	.command("contributors [command] [arguments...]", "Generate, add, and check from all-contributors-cli.")
	.action(function(args, callback) {
		contribCli(args.command, args.arguments)
			.then(callback)
			.catch(() => {
				this.log("Error while using all-contributors-cli.");
			});
	})
);


/*
	Render icons
*/
(vorpal
	.command("render [input path] [output path]", "Render an SVG file using a headless browser.")
	.option("-w --width [px]", "width for SVGs, defaults to viewbox")
	.option("-h --height [px]", "height for SVGs, defaults to viewbox")
	.option("-c --chrome", "use convert-svg-to-png (headless Chrome) to render (default)") // Only there in case the default changes
	.option("-p --phantom", "use svg2png (PhantomJS) to render")
	.action(function(args, callback) {
		const {options} = args;
		const inputPath = args["input path"];
		const outputPath = args["output path"];

		if (!inputPath) {
			throw new Error("Missing input path.");
		}

		const method = options.phantom ? "phantom" : "chrome";

		render[method](inputPath, outputPath, options.width, options.height)
			.then(() => {
				this.log(`Saved render to ${outputPath || "./output.png"}`);
				callback();
			})
			.catch(error => {
				throw new Error(`Couldn't render icon.\n\n${error}`);
			});
	})
);


/*
	Icon thumbnails
*/
(vorpal
	.command("thumbnail [input path] [output path]", "Get a thumbnail of XMP of a file.")
	.action(function(args, callback) {
		const inputPath = args["input path"];
		const outputPath = args["output path"];

		if (!inputPath) {
			throw new Error("Missing input path.");
		}

		thumbnail(inputPath, outputPath)
			.then(() => {
				this.log(`Saved thumbnail to ${outputPath || "./output.jpg"}`);
				callback();
			})
			.catch(error => {
				this.log(`Couldn't find or save thumbnail.\n\n ${error}`);
				callback();
			});
	})
);


/*
	Convert to SVG
*/
(vorpal
	.command("convert [input path] [output path]", "Create a plain SVG file using Inkscape.")
	.action(function(args, callback) {
		const inputPath = args["input path"];
		const outputPath = args["output path"];

		if (!inputPath) {
			throw new Error("Missing input path.");
		}

		convert(inputPath, outputPath)
			.then(() => {
				this.log(`Saved plain SVG file to ${outputPath || "./output.svg"}`);
				callback();
			})
			.catch(error => {
				this.log(`Couldn't save SVG file.\n\n ${error}`);
				callback();
			});
	})
);


/*
	Get JSON for files and directories
*/
(vorpal
	.command("dirjson [directory] [output path]", "Save JSON representing files and directories.")
	.action(function(args, callback) {
		const {directory} = args;
		const outputPath = args["output path"];

		dir.saveJson(directory, outputPath)
			.then(() => {
				this.log(`Saved JSON file to ${outputPath || "./output.json"}`);
				callback();
			})
			.catch(error => {
				this.log(`Couldn't save JSON of files.\n\n ${error}`);
				callback();
			});
	})
);


/*
	Log metadata

	Example - get author(s): node ./bin/cli metadata get "../icons/Adobe/Adobe After Effects.ai" x:xmpmeta rdf:RDF 0 rdf:Description 0 dc:creator 0 rdf:Seq 0 rdf:li
*/
(vorpal
	.command("metadata get [file path] [key path...]", "Log the XMP metadata for AI files.")
	.action(function(args, callback) {
		const filePath = args["file path"];
		const keyPath = args["key path"];

		if (!filePath) {
			throw new Error("Missing input path.");
		}

		// let fileType;
		// try {
		// 	fileType = path.match(/\.(svg|ai|psd)$/)[1];
		// } catch (error) {
		// 	throw new Error("Invalid input path file extension.");
		// }

		metadata.get(filePath)
			.then((data) => {
				this.log(
					util.inspect(
						_.at(data, keyPath.join("."))[0],
						false,
						null
					)
				);
				callback();
			})
			.catch(error => {
				throw new Error(`Couldn't get metadata.\n\n${error}`);
			});
	})
);


/*
	Setup
*/
// Run Vorpal
(vorpal
	.delimiter("materialos/toolkit:")
	.show()
	.parse(process.argv)
);

// Command History
vorpal.history("materialos/toolkit");
