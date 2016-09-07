/**
 * Created by surenkov on 9/7/16.
 */
'use strict';
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const HtmlPlugin = require('html-webpack-plugin');
const TextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('manifest-revision-webpack-plugin');

const utility = require('./utility');


module.exports = (_path, env) => {
    const src = (paths) => path.join.apply(path.join, [_path, 'landing', 'front'].concat(paths || []));
    const deps = () => ['jquery', 'lodash'];
    const output = (paths) => path.join.apply(path.join, [_path, 'landing'].concat(paths || []));

    const commonConfig = {
        context: _path,
        entry: {
            app: [
                src(['scripts', 'app.js']),
                src(['styles', 'base.less']),
            ],
            vendor: deps()
        },
        output: {
            path: output(),
            publicPath: '/',
            filename: path.join('static', 'scripts', '[name].bundle.js'),
            chunkFilename: '[id].bundle.[hash].js'
        },
        module: {
            loaders: [
                { test: /\.html$/, loaders: ['html'] },
                { test: /\.js?$/, exclude: /(node_modules|static)/, loaders: ['babel'] },
                {
                    test:    /\.(ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif|svg)$/i,
                    loaders: ['url?context=' + src() + '&limit=30000&name=static/assets/[name].[hash].[ext]']
                },
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': env
            }),

            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                _: 'lodash'
            }),


            new HtmlPlugin({
                chunks: ['app', 'vendor'],
                filename: output(['templates', 'index.html']),
                inject: false,
                template: '!!ejs!' + src(['index.html'])
            }),
        ]
    };

    const runtimeConfig = {
        'development': {
            debug: true,
            devtool: 'eval-source-map',
            entry: {
                app: [
                    'webpack/hot/dev-server',
                    'webpack-dev-server/client?http://localhost:8080/',
                ]
            },
            module: {
                loaders: [
                    { test: /\.css$/, loaders: ['style', 'css', 'postcss'] },
                    { test: /\.less$/, loaders: ['style', 'css', 'postcss', 'less?sourceMap'] },
                ]
            },
            devServer: {
                contentBase: output(),
                info: true,
                hot: true,
                inline: true
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin()
            ]
        },

        'production': {
            debug: false,
            devtool: 'source-map',
            module: {
                loaders: [
                    { test: /\.css$/, loader: TextPlugin.extract('style', ['css', 'postcss']) },
                    { test: /\.less$/, loader: TextPlugin.extract('style', ['css', 'postcss', 'less?sourceMap']) },
                ]
            },
            plugins: [
                new ManifestPlugin(output(['static', 'manifest.json']), {
                    rootAssetPath: './landing/front/'
                }),

                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    },
                    mangle: {
                        except: ['$super', '$', '_', 'exports', 'require']
                    }
                }),

                new TextPlugin('static/styles/[name].[hash].css'),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendor',
                    filename: 'static/scripts/[name].bundle.[hash].js',
                    minChunks: Infinity
                }),
            ]
        }
    };

    return _.mergeWith(commonConfig, runtimeConfig[env], utility.mergeCustomizer);
};

