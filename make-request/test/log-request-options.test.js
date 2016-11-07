/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0 */
'use strict';
const logRequestOptions = require('../log-request-options');

describe('nice-request/make-request/log-request-options', function() {
  let optionsStub;
  let requestOptionsStub;
  let loggerStub;

  beforeEach(function() {
    optionsStub = {
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      metricTag: 'test_request',
      method: 'GET'
    };
    requestOptionsStub = {
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      method: 'GET'
    };
    loggerStub = {
      info: sinon.spy()
    };
  });

  it('is a function', function() {
    expect(logRequestOptions).to.be.a('function');
  });

  it('calls the logger with the proper data', function() {
    logRequestOptions(loggerStub, optionsStub, requestOptionsStub);
    expect(loggerStub.info).to.have.been.calledWithExactly({
      message: 'nice-request options',
      exception: {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        method: 'GET'
      }});
  });

  it('logs headers if available', function() {
    logRequestOptions(loggerStub, optionsStub, requestOptionsStub);
    expect(loggerStub.info).to.have.been.calledWithExactly({
      message: 'nice-request options',
      exception: {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        method: 'GET'
      }
    });
  });
});
