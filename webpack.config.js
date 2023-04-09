const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const packageData = require('./package.json');

module.exports = [
	{
		mode: 'production',
		name: 'childrenLoaded',
		entry: './src/index.js',
		target: 'web',
		output: {
			library: 'childrenLoaded',
			libraryTarget: 'var',
			filename: 'children-loaded.js',
			path: path.resolve(__dirname, './dist')
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: `children-loaded v${packageData.version}\nhttps://github.com/alexspirgel/children-loaded`
			})
		],
		optimization: {
			minimize: false
		},
		watch: true
	},
	{
		mode: 'production',
		name: 'childrenLoaded',
		entry: './src/index.js',
		target: 'web',
		output: {
			library: 'childrenLoaded',
			libraryTarget: 'var',
			filename: 'children-loaded.min.js',
			path: path.resolve(__dirname, './dist')
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: `children-loaded v${packageData.version}\nhttps://github.com/alexspirgel/children-loaded`
			})
		],
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					extractComments: false,
					terserOptions: {
						keep_classnames: true
					}
				})
			]
		},
		watch: true
	}
];