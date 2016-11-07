/**
 * setup assertion framework and test libraries
 */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Promise = require('bluebird');
require('sinon-as-promised')(Promise);

// needed to transfer bluebird promises
chaiAsPromised.transferPromiseness = (assertion, promise) => {
  assertion.then = promise.then.bind(promise);
  if (promise.finally) {
    assertion.finally = promise.finally.bind(promise);
  }
};

chai.use(chaiAsPromised);
chai.use(sinonChai);

// assign globals
global.expect = chai.expect;
global.sinon = sinon;
