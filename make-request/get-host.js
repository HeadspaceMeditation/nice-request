'use strict';
const url = require('url');

module.exports = sourceUrl => url.parse(sourceUrl).host.replace(/\./g, '_').replace(/:[0-9]*/, '');
