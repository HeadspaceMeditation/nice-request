'use strict';

const isNull = require('lodash/isNull');

/**
 * Logs the request options adding useful metadata
 * @param {Logger} log Application logger instance
 * @param {NICERequestOptions} options Original Request options
 * @param {object} requestOptions Request options object
 * @return {undefined}
 */
module.exports = (log, options, requestOptions) => {
  if (!isNull(log)) {
    log.info('nice-request options', requestOptions);
  }
};
