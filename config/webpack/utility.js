/**
 * Created by surenkov on 9/7/16.
 */
'use strict';
const _ = require('lodash');

module.exports = {
    mergeCustomizer: (objValue, srcValue) => {
        if (_.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    }
};

