'use strict';
const NiceError = require('nice-http-error');
const _ = require('lodash');
const buildErrorMetaData = require('./build-error-meta-data');

/**
 * Builds a useful error message and extends the existing error with useful properties
 * @param {NICERequestOptions} options Request options
 * @param {Error} error Error thrown by the request
 * @return {NiceError} Extended error instance
 */
module.exports = (options, error) => {
  const cause = _.get(error, 'error.message', _.get(error, 'message'));
  const message = `${options.method} to ${options.url} failed: ${cause}`;

  return NiceError.create(message, {
    detail: _.get(error, 'error.detail'),
    status: error.statusCode,
    code: _.get(error, 'error.code'),
    error: buildErrorMetaData(options, error)
  });
};
