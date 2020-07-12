/*
	XML templates
*/
const templates = {
	"appfilter.xml": {
		"prefix": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<resources>\n",
		"icon": "\t<item component=\"ComponentInfo{${activity}}\" drawable=\"${icon.drawable}\"/>\n",
		"suffix": "</resources>\n"
	},
	"drawable.xml": {
		"prefix": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<resources>\n\t<version>${theme.version.code}</version>\n",
		"suffix": "</resources>\n",
		"icon": "\t<item drawable=\"${icon.drawable}\"/>\n",
		"category": "\n\t<category title=\"${category}\"/>\n"
	},
	"theme_resources.xml": {
		"prefix": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<Theme version=\"${theme.version.code}\">\n\t<Label value=\"${theme.name}\"/>\n\t<Wallpaper image=\"${theme.wallpaper}\"/>\n\t<LockScreenWallpaper image=\"${theme.wallpaper}\"/>\n\t<ThemePreview image=\"${theme.preview}\"/>\n\t<ThemePreviewWork image=\"${theme.preview}\"/>\n\t<ThemePreviewMenu image=\"${theme.preview}\"/>\n\t<DockMenuAppIcon selector=\"${theme.appdrawer}\"/>\n",
		"icon": "\t<AppIcon name=\"${activity}\" image=\"${icon.drawable}\"/>\n",
		"suffix": "</Theme>\n"
	},
	"appmap.xml": {
		"prefix": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<appmap>\n",
		"icon": "\t<item class=\"${shortactivity}\" name=\"${icon.drawable}\"/>\n",
		"suffix": "</appmap>\n"
	},
	"themecfg.xml": {
		"prefix": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<theme>\n\t<version>${theme.version.name}</version>\n\t<themeName>${theme.name}</themeName>\n\t<themeInfo>${theme.description}</themeInfo>\n\t<preview img1=\"${theme.preview}\"/>\n</theme>\n"
	},
	"themeinfo.xml": {
		"prefix": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<themeInfo>\n\t<packageName>${theme.package}</packageName>\n\t<versionName>${theme.version.name}</versionName>\n\t<versionCode>${theme.version.code}</versionCode>\n\t<themeName>${theme.name}</themeName>\n\t<themePointColor>${theme.color}</themePointColor>\n\t<themePreview img1=\"${theme.preview}\"/>\n\t<preview img1=\"${theme.preview}\"/>\n</themeInfo>\n"
	}
};


/*
	Theme values
	TODO: move out to config file in correct repo
*/
// `theme` can be evaled
const theme = { // eslint-disable-line no-unused-vars
	"name": "MaterialOS",
	"description": "MaterialOS is a free and open source Material Design icon pack.",
	"package": "org.materialos.icons",
	"version": {
		"name": "",
		"code": ""
	},
	"color": "#2196f3",
	"preview": "preview1",
	"wallpaper": "wallpaper",
	"appdrawer": "app_drawer"
};


/*
	Generator function
*/
module.exports = function(templateName, icons) {
	const template = templates[templateName];

	// Prefix
	let output = template.prefix;


	// Repeat over icons
	// `icon` can be evaled
	for (const icon of icons) { // eslint-disable-line no-unused-vars
		icon.drawable = icon.name
			.replace(/-/g, "--")
			.replace(/\s+/g, "-")
			.replace(/_/g, "__")
			.replace(/[A-Z]/g, "_$&");

		// `activity` can be evaled
		for (const activity of icon.activities) { // eslint-disable-line no-unused-vars
			// `shortactivity` can be evaled
			const shortactivity = activity.replace(/^.+\//, ""); // eslint-disable-line no-unused-vars

			output += template.icon.replace(
				/\${([^}]+)}/g,
				(match, expression) => (eval(expression))
			);
		}
	}

	// Suffix
	output += template.suffix;

	return output;
};
