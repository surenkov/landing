'use strict';
const config = require('./config/global');
module.exports = config(__dirname, process.env.NODE_ENV);
