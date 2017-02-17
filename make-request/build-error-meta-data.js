'use strict';
const _ = require('lodash');
const setStack = require('./set-stack');
const buildTag = require('./build-tag');

/**
 * @typedef  {object} ErrorMetaData
 * @property {string} niceRequestTag Full metric tag
 * @property {NICERequestOptions} niceRequestOptions Omits some properties
 * @property {string} [stack] Original error stack trace. Not enumerable.
 */

/**
 * Builds error metadata using request's useful information
 * @param {NICERequestOptions} options Request options
 * @param {Error} error Error thrown by the request
 * @return {ErrorMetaData} Error metadata including the stack if available
 */
module.exports = (options, error) => {
  const metadata = {
    niceRequestTag: buildTag(options),
    niceRequestOptions: _.omit(options, ['metricTag', 'log'])
  };

  const composedMetaData = _.isObject(error.error)
    ? Object.assign(_.omit(error.error, 'code', 'detail'), metadata)
    : metadata;

  return setStack(composedMetaData, error);
};
