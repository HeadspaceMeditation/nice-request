'use strict';
const merge = require('lodash/merge');
const pick = require('lodash/pick');
const get = require('lodash/get');
const has = require('lodash/has');
const logRequestOptions = require('./log-request-options');

const TIMEOUT = 25000;

/**
 * Log and setup the requirements for the request-promise library to make the http call
 * @param {object} options - details to setup headers and make the http request
 * @return {object} requestOptions - the object setting the properties of the request
 */

module.exports = options => {
  const baseOptions = pick(options,
    'body',
    'headers',
    'method',
    'rejectUnauthorized',
    'resolveWithFullResponse',
    'url');

  const additionalOptions = {
    json: true,
    timeout: options.timeout || TIMEOUT
  };

  if (has(options, 'queryString')) {
    Object.assign(additionalOptions, {qs: get(options, 'queryString')});
  }

  if (has(options, 'formData')) {
    Object.assign(additionalOptions, pick(options, 'formData'));
  }

  const requestOptions = merge(baseOptions, additionalOptions);

  logRequestOptions(options.log, options, requestOptions);

  return requestOptions;
};
