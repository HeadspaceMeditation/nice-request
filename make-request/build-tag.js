'use strict';
const getHost = require('./get-host');

/**
 * Builds a complete metric tag
 * @param {NICERequestOptions} options Request options
 * @return {string} Composed metrics tag
 */
module.exports = options => {
  const host = getHost(options.url);
  const metricTag = options.metricTag.replace(/\./g, '_');

  return `${options.projectTag}.${host}.${metricTag}.${options.method}`;
};
