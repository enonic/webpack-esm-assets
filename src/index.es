/* eslint-disable import/prefer-default-export */

import glob from 'glob';
import path from 'path';
import EsmWebpackPlugin from '@purtuga/esm-webpack-plugin';
//import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));
// const toStr = v => JSON.stringify(v, null, 4);

const SRC_ASSETS_DIR = 'src/main/resources/assets';
const DST_ASSETS_DIR = 'build/resources/main/assets';


//const UX_PATH_SEP = '/';


export function toEntryKey(relativePath) {
	let ext = path.extname(relativePath);
	let fin = path.relative(SRC_ASSETS_DIR, relativePath);
	return fin.replace(ext, '');
}

export function toEntryValue(relativePath) {
	let fin = path.relative(SRC_ASSETS_DIR, relativePath);
	return '.' + path.sep + fin;
}


export function webpackEsmAssets(params) {
	const { __dirname } = params;
	if (!__dirname) {
		throw new Error('webpackStyleAssets: __dirname is a required parameter');
	}
	const {
		extensions = ['mjs', 'jsx', 'esm', 'es', 'es6', 'js'],
		extensionsGlob = `{${extensions.join(',')}}`,
		assetsGlob = `${SRC_ASSETS_DIR}/**/*.${extensionsGlob}`,
		assetFiles = glob.sync(assetsGlob),
		context = path.join(__dirname, SRC_ASSETS_DIR),
		devtool = false,
		entry = dict(
			assetFiles.map(k => [
				toEntryKey(k), // name
				toEntryValue(k) // source relative to context
			])
		),
		externals,
		mode = 'production',

		optimization,

		outputFilename = '[name].esm.js',
		outputPath = path.join(__dirname, DST_ASSETS_DIR),
		output = {
			filename: outputFilename,
			library: 'LIB',
			libraryTarget: 'var',
			path: outputPath
		},
		performanceHints = false,
		performance = {
			hints: performanceHints
		},

		plugins = [],

		resolveAlias,
		resolveExtensions = ['mjs', 'jsx', 'esm', 'es', 'es6', 'js', 'json'],
		resolve = {
			alias: resolveAlias,
			extensions: resolveExtensions.map(ext => `.${ext}`)
		},

		stats = {
			colors: true,
			hash: false,
			maxModules: 0,
			modules: false,
			moduleTrace: false,
			timings: false,
			version: false
		}
	} = params;
	// console.log(toStr({ assetFiles }));
	return {
		context,
		devtool,
		entry,
		externals,
		mode,
		module: {
			rules: [
				{
					test: /\.(es6?|m?jsx?)$/, // Will need js for node module depenencies
					exclude: [
						/\bcore-js\b/,
						/\bwebpack\b/,
						/\bregenerator-runtime\b/,
					],
					use: [
						{
							loader: 'babel-loader',
							options: {
								babelrc: false, // The .babelrc file should only be used to transpile config files.
								comments: false,
								compact: false,
								minified: false,
								plugins: [
									'@babel/plugin-proposal-class-properties',
									'@babel/plugin-proposal-export-default-from',
									'@babel/plugin-proposal-export-namespace-from',
									'@babel/plugin-proposal-object-rest-spread',
									'@babel/plugin-syntax-dynamic-import',
									'@babel/plugin-syntax-throw-expressions',
									'@babel/plugin-transform-object-assign',
									/* ['@babel/plugin-transform-runtime', { // This destroys esm.
											regenerator: true
										}],*/
									'array-includes'
								],
								presets: [
									[
										'@babel/preset-env',
										{
											corejs: 3, // Needed when useBuiltIns: usage

											// Enables all transformation plugins and as a result,
											// your code is fully compiled to ES5
											forceAllTransforms: true,

											targets: {
												esmodules: false, // Enonic XP doesn't support ECMAScript Modules

												// https://node.green/
												node: '0.10.48'
											},

											//useBuiltIns: false // no polyfills are added automatically
											//useBuiltIns: 'entry' // replaces direct imports of core-js to imports of only the specific modules required for a target environment
											useBuiltIns: 'usage' // polyfills will be added automatically when the usage of some feature is unsupported in target environment
										}
									],
									'@babel/preset-react'
								]
							} // options
						}
					]
				},
			] // rules
		}, // module
		optimization,
		output,
		performance,
		plugins: plugins.concat(
			new EsmWebpackPlugin(),
		),
		resolve,
		stats
	};
} // function webpackEsmAssets
