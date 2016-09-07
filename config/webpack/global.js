/**
 * Created by surenkov on 9/7/16.
 */
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = () => ({
    externals: {
        jquery: "jQuery",
        lodash: '_'
    },

    resolve: {
        extensions: ['', '.js', '.jsx'],
        moduleDirectories: ['node_modules'],
    },

    postcss: () => [autoprefixer],
});
