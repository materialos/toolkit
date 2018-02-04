/*
	Module dependencies
*/
const fs = require("pn/fs");
const util = require("util");
const svgo = require("svgo");
const {svg2js, js2svg} = require("./psvgo.js");
const path = require("path");
const _ = require("lodash");


/*
	Expose svgo abstraction
*/
const optimize = function(inputPath, outputPath = "./output.svg", options) {
	const svgoInstance = new svgo(options);
	return new Promise(function(resolve, reject) {
		fs.readFile(inputPath)
			.then(buffer => svgoInstance.optimize(buffer))
			.then(({data}) => fs.writeFile(outputPath, data))
			.then(resolve)
			.catch(error => reject(error));
	});
};


/*
	Minify SVGs using optimize with a config
	TODO: Use px not points
*/
const minify = function(
	inputPath,
	outputPath,
	pretty = false
) {
	const options = {
		"full": true,
		"plugins": [
			"cleanupAttrs",
			"removeDoctype",
			"removeComments",
			"removeTitle",
			"removeDesc",
			"removeHiddenElems",
			"removeUselessDefs",
			"removeEditorsNSData",
			"removeEmptyAttrs",
			"removeEmptyText",
			"minifyStyles",
			"convertStyleToAttrs",
			"convertColors",
			"removeUselessStrokeAndFill",
			"removeUnusedNS",
			"cleanupIDs",
			"mergePaths",
			"convertShapeToPath",
			"sortAttrs"
		]
	};

	if (pretty) {
		options.js2svg = {
			"pretty": true,
			"indent": "\t"
		};
	}


	return optimize(inputPath, outputPath, options);
};


/*
	Insert MaterialOS metadata
*/
const appendChild = function(parent, child) {
	return (parent.content.push(child), parent);
};
const mutateDefaultXmp = async function(data, title, authors) {
	// Replace titles
	const titles = data.querySelectorAll("dc\\:title > rdf\\:Alt > rdf\\:li");
	titles.forEach(value => {
		value.content[0].text = title;
	});

	// Add authors
	if (authors) {
		let authorXml = "<dc:creator><rdf:Seq>";
		for (const author of authors) {
			authorXml += `<rdf:li>${author}</rdf:li>`;
		}
		authorXml += "</rdf:Seq></dc:creator>";
		const authorJs = await svg2js(authorXml);
		appendChild(data.querySelector("rdf\\:RDF"), authorJs);
	}

	// Return the contents of the XML document in object form
	return data.content;
};
const metadata =  {
	add(
		inputPath,
		outputPath,
		title = inputPath.match(/([^/]+)(\.\w+)$/)[1],
		authors
	) {
		// Use svg2js from svgo as an XML parser (with te extra properties that are required
		// by js2svg) for the default XMP packet
		const xmpPath = path.join(__dirname, "..", "CC_Attribution_4.0_International.xmp");

		// Read file
		return fs.readFile(xmpPath)
			// Convert to object
			.then(svg2js)
			// Add authors and title
			.then(data => mutateDefaultXmp(data, title, authors))
			.catch(error => {
				throw new Error(`Failed to generate XMP.\n\n${error}`);
			})
			.then(newXmp => {
				const options = {
					"full": true,
					"plugins": [
						{
							"addMetadata": {
								"params": {
									"xpacketstart": newXmp[0],
									"xmpmeta": newXmp[1],
									"xpacketend": newXmp[2]
								},
								"type": "full",
								"active": true,
								"description": "adds metadata acknowledging contributors and MaterialOS",
								fn(data, params) {
									const {xpacketstart, xmpmeta, xpacketend} = params;
									const metadataEle = data.querySelector("metadata");
									const xmpmetaEle = data.querySelector("x\\:xmpmeta");

									if (xmpmetaEle) {
										// Merge the objects, prefer new XMP
										_.merge(xmpmetaEle, xmpmeta);
									} else {
										let target = metadataEle;

										if (!target) {
											throw new Error("I can't be bothered to make a metadata tag in your SVG");
										}

										// Add the new XMP to the metadata
										appendChild(target, xpacketstart);
										appendChild(target, xmpmeta);
										appendChild(target, xpacketend);
									}

									// Remove disallowed tags
									const monkeys = function(items, fn) {
										items.content.forEach((item) => {
											fn(item);

											if (item.content) {
												monkeys(item, fn);
											}
										});
										return items;
									};

									// return monkeys(data);

									fs.writeFile("./test.js", util.inspect(data, {depth: null}));

									return data;
								}
							}
						}
					]
				};

				options.js2svg = {
					"pretty": true,
					"indent": "\t"
				};


				return optimize(inputPath, outputPath, options);
			})
			.catch(error => {
				throw new Error(`Couldn't add XMP data to the file.\n\n${error}`);
			});
	},


	remove(inputPath, outputPath) {
		const options = {
			"full": true,
			"plugins": [
				"removeMetadata"
			]
		};


		return optimize(inputPath, outputPath, options);
	}
};


/*
	And and remove authors from metadata
*/
const authors = function(inputPath, outputPath, add, remove) {
	const options = {
		"full": true,
		"plugins": [
			{
				"editAuthors": {
					"params": {add, remove},
					// "type": "perItem",
					"active": true,
					"description": "adds metadata acknowledging contributors and MaterialOS",
					fn(data) {
						console.log(...arguments);


						/*
							Add and remove authors
							Error if reached end without
						*/

						return data;
					}
				}
			}
		]
	};


	return optimize(inputPath, outputPath, options);
};


/*
	Export
*/
module.exports = {minify, optimize, metadata, authors};


/*
	Test
*/
// minify("../icons/icons/Adobe/Illustrator.svg", undefined, true);
metadata.add("./Kik.svg", undefined, undefined, ["Daniel Hickman", "Corbin Crutchley"]);
// metadata.add("../icons/icons/Adobe/Illustrator.svg", undefined, undefined, ["Daniel Hickman", "Corbin Crutchley"]);
