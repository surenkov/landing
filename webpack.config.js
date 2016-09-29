'use strict';
const config = require('./config/webpack/global');
module.exports = config(__dirname, process.env.NODE_ENV);