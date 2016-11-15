'use strict';
const makeRequest = require('./make-request');

/**
 * @type {string}
 */
let projectTag = '';

/**
 * @typedef  {object} Logger
 * @property {logFunction} info
 * @example
 *  log.info(message, metadata);
 */
let log = null;

/**
 * Setup log and project tag
 * @param {string} tag - main project tag
 * @param {Logger} logger - object with log utility functions
 */
exports.setup = (tag, logger) => {
  log = logger || null;
  projectTag = tag;
};

/**
 * @typedef  {object} NICERequestOptions
 * @property {string} projectTag assigned to the request for logging purposes
 * @property {Logger} log Application logger instance
 * @property {string} url Full url to make the request to
 * @property {string} method HTTP method (GET, POST, PUT ...)
 * @property {object} [headers] Custom request headers
 * @property {object} [body] Request payload
 * @property {object|string} [querystring] Request query string
 * @property {number} [timeout=2500] Request timeout in milliseconds
 */

/**
 * Extends options with closure variables and defaults method property
 * @param {NICERequestOptions} options Received options object
 * @return {NICERequestOptions} Full request options
 */
const extendOptions = options => Object.assign(options, {
  method: (options.method || 'GET').toUpperCase(),
  log,
  projectTag
});

/**
 * Makes service to service requests to other services
 * @param {NICERequestOptions} options - details to setup headers and make the http request
 * @return {Promise.<object>} the response body from the service we make the call to
 */
exports.request = options => makeRequest(extendOptions(options));
