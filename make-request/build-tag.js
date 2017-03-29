'use strict';
const getHost = require('./get-host');

/**
 * Builds a complete metric tag
 * @param {NICERequestOptions} options Request options
 * @return {string} Composed metrics tag
 */
module.exports = options => `${options.projectTag}.${getHost(options.url)}.${options.metricTag}.${options.method}`;
