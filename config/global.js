/**
 * Created by surenkov on 9/7/16.
 */
'use strict';
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const utility = require('./utility');
const TextPlugin = require('extract-text-webpack-plugin');


const blocksPath = 'blocks/';
const blocks = utility.blockResolver(blocksPath);

module.exports = (_path, env) => {
    const commonConfig = {
        context: _path,
        entry: {
            manager: _.concat([
                    'whatwg-fetch',
                    './manager/static/scripts/index.js',
                    './manager/static/styles/index.scss'
                ],
                utility.blockAssets('manager', blocks)
            ),
            landing: _.concat([
                    'script!jquery/dist/jquery.min.js',
                    './landing/static/scripts/index.js',
                    './landing/static/styles/index.scss'
                ],
                utility.blockAssets('landing', blocks)
            ),
        },
        output: {
            path: path.join(_path, 'static'),
            filename: 'scripts/[name].js',
            chunkFilename: 'scripts/[id].js'
        },
        externals: [{
            'fetch': 'whatwg-fetch',
            '$': 'jquery',
            'jQuery': 'jquery'
        }],
        resolve: {
            extensions: ['', '.js', '.jsx'],
        },
        module: {
            loaders: [
                {
                    test:    /\.(png|jpe?g|gif|svg)$/i,
                    loaders: ['url?limit=30000&name=assets/[name].[ext]', 'image-webpack']
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/i,
                    loaders: ['url?limit=30000&name=assets/fonts/[name].[ext]']
                },
                {
                    test:    /\.ico$/i,
                    loaders: ['file?name=assets/icons/[name].[ext]']
                },
            ]
        },
        postcss: () => [autoprefixer],
        imageWebpackLoader: {
            optimizationLevel: 4,
            progressive: true,
            interlaced: true,
            pngquant: {
                quality: '90-100',
                speed: 5
            },

        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env)
            }),

            new webpack.ProvidePlugin({
                React: 'react',
                _: 'lodash'
            }),
        ]
    };

    const runtimeConfig = {
        'development': {
            debug: true,
            devtool: 'eval-source-map',
            output: {
                publicPath: 'http://localhost:8080/static/'
            },
            devServer: {
                contentBase: './'
            },
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/i,
                        exclude: /(node_modules)/i,
                        loaders: ['react-hot', 'babel'],
                    },
                    { test: /\.css$/, loaders: ['style', 'css', 'postcss'] },
                    { test: /\.s[ac]ss$/, loaders: ['style', 'css', 'postcss', 'sass?sourceMap'] },
                ]
            }
        },
        'production': {
            debug: false,
            devtool: 'source-map',
            output: {
                publicPath: '/static/'
            },
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/i,
                        exclude: /(node_modules)/i,
                        loaders: ['babel'],
                    },
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

                new TextPlugin('styles/[name].css'),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.OccurenceOrderPlugin()
            ]
        }
    };

    return _.mergeWith(commonConfig, runtimeConfig[env], utility.mergeCustomizer);
};
