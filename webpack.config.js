'use strict';

const env = process.env.NODE_ENV || 'development';

const webpack = require('webpack');
const path = require('path');
const webpackUMDExternal = require('webpack-umd-external');

const pluginsList = [];
const outputFileName = env === 'production' ?
    'react-dynamic-content.min.js' :
    'react-dynamic-content.js';

if (env === 'production') {
    pluginsList.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            output: { comments: false }
        })
    );
}

const config = {
    entry: path.join(__dirname, 'src/DynamicContent.jsx'),

    output: {
        path: path.join(__dirname, 'dist'),
        filename: outputFileName,
        library: 'DynamicContent',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    externals: webpackUMDExternal({
      'react': 'react',
      'react-dom': 'react-dom',
      'lodash': 'lodash',
      'react-addons-update': 'react-addons-update',
      'rx': 'rx',
      'jquery': 'jquery',
      'jquery.waitforimages': 'jquery.waitforimages'
    }),

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    plugins: pluginsList,

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['babel']
        }]
    }
};

module.exports = config;
