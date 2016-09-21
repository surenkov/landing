/**
 * Created by surenkov on 9/7/16.
 */
'use strict';
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const utility = require('./utility');
const HtmlPlugin = require('html-webpack-plugin');
const TextPlugin = require('extract-text-webpack-plugin');


const blocksPath = require('../landing/config.json').blocks_dir;
const blocks = utility.blockResolver(blocksPath);

module.exports = (_path, env) => {
    const commonConfig = {
        context: _path,
        entry: {
            manager: _.concat([
                    './manager/front/scripts/index.js',
                    './manager/front/styles/index.scss'
                ],
                utility.blockAssets('manager', blocks)
            ),
            landing: _.concat([
                    './landing/front/scripts/index.js',
                    './landing/front/styles/index.scss'
                ],
                utility.blockAssets('landing', blocks)
            ),
        },
        output: {
            path: path.join(_path, 'static'),
            publicPath: '/static/',
            filename: 'scripts/[name].[hash].js',
            chunkFilename: 'scripts/[id].[hash].js'
        },
        externals: {
            jquery: "jQuery",
            lodash: '_'
        },
        resolve: {
            extensions: ['', '.js', '.jsx'],
            moduleDirectories: ['node_modules'],
        },
        module: {
            loaders: [
                {
                    test: /\.html$/,
                    loaders: ['html']
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|static)/,
                    loaders: ['babel']
                },
                {
                    test:    /\.(ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif|svg)$/i,
                    loaders: ['url?limit=30000&name=assets/[name].[hash].[ext]']
                },
            ]
        },
        postcss: () => [autoprefixer],
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env)
            }),

            new webpack.ProvidePlugin({
                React: 'react',
                _: 'lodash',
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            }),

            new HtmlPlugin({
                chunks: ['manager'],
                filename: '../templates/manager.html',
                inject: false,
                template: '!!ejs!./manager/front/index.html'
            }),

            new HtmlPlugin({
                chunks: ['landing'],
                filename: '../templates/landing.html',
                inject: false,
                template: '!!ejs!./landing/front/index.html'
            }),
        ]
    };

    const runtimeConfig = {
        'development': {
            debug: true,
            devtool: 'eval-source-map',
            module: {
                loaders: [
                    { test: /\.css$/, loaders: ['style', 'css', 'postcss'] },
                    { test: /\.s[ac]ss$/, loaders: ['style', 'css', 'postcss', 'sass?sourceMap'] },
                ]
            }
        },
        'production': {
            debug: false,
            devtool: 'source-map',
            module: {
                loaders: [
                    { test: /\.css$/, loader: TextPlugin.extract('style', ['css', 'postcss']) },
                    { test: /\.s[ac]ss$/, loader: TextPlugin.extract('style', ['css', 'postcss', 'sass?sourceMap']) },
                ]
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    compress: { warnings: false },
                    mangle: {
                        except: ['$super', '$', '_', 'exports', 'require']
                    }
                }),

                new TextPlugin('styles/[name].[hash].css'),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.OccurenceOrderPlugin()
            ]
        }
    };

    return _.mergeWith(commonConfig, runtimeConfig[env], utility.mergeCustomizer);
};
