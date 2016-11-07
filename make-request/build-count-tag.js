'use strict';
const getHost = require('./get-host');

/**
 * Builds a complete metric tag for a status counter
 * @param {NICERequestOptions} options Request options
 * @param {number} statusCode the HTTP status code
 * @return {string} Composed metrics tag
 */
module.exports = (options, statusCode) =>
  `${options.projectTag}.${getHost(options.url)}.${statusCode}`;
