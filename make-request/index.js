'use strict';
const request = require('request-promise');
const getRequestOptions = require('./get-request-options');
const buildError = require('./build-error');
const buildTag = require('./build-tag');
const retryRequest = require('./retry-request');
const isNull = require('lodash/isNull');
const isFunction = require('lodash/isFunction');

const STATUS_OK = 200;

/**
 * Submits the request and keeps track of the timer
 * @param {NICERequestOptions} options Request options
 * @return {Promise.<object|string>} Resolves to the response body
 */
module.exports = options => {
  if (!options.metricTag) {
    throw new TypeError('nice-request: a metricTag is required to submit a request');
  }
  if (options.errCond && !options.maxTries) {
    const errorMessage = 'nice-request: a value for maxTries is required when an errCond is present.';
    throw new TypeError(errorMessage);
  }

  let statusCode = STATUS_OK;
  const start = new Date();
  return retryRequest(() => request(getRequestOptions(options)), options.errCond, options.maxTries)
    .catch(error => {
      const builtError = buildError(options, error);
      statusCode = builtError.status;
      throw builtError;
    })
    .finally(() => {
      if (!isNull(options.log) && isFunction(options.log.info)) {
        options.log.info(buildTag(options), {executionTime: `${new Date() - start}`, status: `${statusCode}`});
      }
    });
};
