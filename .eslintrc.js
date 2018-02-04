module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"plugins": ["node"],
	"extends": ["eslint:recommended", "plugin:node/recommended"],
	"parserOptions": {
		"sourceType": "module"
	},
	"rules": {
		"no-console": "off",
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"warn",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-var": [
			"error"
		],
		"object-shorthand": [
			"warn",
			"always"
		],
		"no-throw-literal": [
			"error"
		],
		"quote-props": [
			"warn",
			"as-needed",
			{
				"unnecessary": false,
				"numbers": true
			}
		],
		"no-fallthrough": [
			"error",
			{
				"commentPattern": "falls?\\s?through|break"
			}
		],
		"strict": [
			"error",
			"global"
		]
	}
};
