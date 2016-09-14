/**
 * Created by surenkov on 9/7/16.
 */
'use strict';
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const MANIFEST_FILE_NAME = 'manifest.json';

const mergeCustomizer = (objValue, srcValue) => {
    if (_.isArray(objValue))
        return objValue.concat(srcValue);
};

const exists = (_path) => {
    try {
        fs.accessSync(_path, fs.F_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const blockResolver = (_path) => {
    const blocks = fs.readdirSync(_path)
        .map((entry) => path.join(_path, entry))
        .filter((entry) => fs.statSync(entry).isDirectory())
        .filter((entry) => exists(path.join(entry, MANIFEST_FILE_NAME)));

    const manifests = blocks
        .map((block) => path.join(block, MANIFEST_FILE_NAME))
        .map((manifest) => JSON.parse(fs.readFileSync(manifest, 'utf8')));

    return _.pickBy(_.zipObject(blocks, manifests), (m) => m.enabled);
};

const blockAssets = (type, manifestsObject) => {
    const assetType = {
        'manager': 'manager_assets',
        'landing': 'landing_assets'
    }[type];

    return _.flatMap(
        manifestsObject,
        (manifest, _path) => _.map(
            manifest[assetType] || [],
            (asset) => path.join(_path, asset)
        )
    );
};

module.exports = {
    mergeCustomizer,
    blockResolver,
    blockAssets
};
