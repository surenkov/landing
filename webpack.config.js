'use strict';

const _ = require('lodash');
const utility = require('./config/webpack/utility');


const configs = {
    global: require('./config/webpack/global'),
    manager: require('./config/webpack/manager'),
    landing: require('./config/webpack/landing')
};


var _load = (target, env) => {
    return _.mergeWith(
            configs['global'](),
            configs[target](__dirname, env),
            utility.mergeCustomizer
        );
};


/**
 * Export WebPack config.
 */
module.exports = _load(process.env.BUILD_TARGET, process.env.NODE_ENV);