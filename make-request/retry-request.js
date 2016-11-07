'use strict';
/* eslint no-param-reassign: 0, */

const retryRequest = (request, errCond, maxTries, attempts) => {
  if (!attempts) {
    attempts = 1;
  }
  return request().catch(error => {
    if (errCond && errCond(error) && attempts < maxTries) {
      return retryRequest(request, errCond, maxTries, ++attempts);
    }
    throw error;
  });
};


module.exports = retryRequest;
