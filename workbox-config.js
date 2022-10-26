module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{html,css,js}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};