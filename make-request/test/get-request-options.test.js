/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0 */
'use strict';
const proxyquire = require('proxyquire');

describe('nice-request/make-request/get-request-options', function() {
  let getRequestOptions;
  let logRequestOptionsStub;
  let optionsStub;

  beforeEach(function() {
    logRequestOptionsStub = sinon.spy();
    optionsStub = {
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      metricTag: 'test_request',
      method: 'GET',
      timeout: 1000,
      resolveWithFullResponse: true,
      rejectUnauthorized: true
    };

    getRequestOptions = proxyquire('../get-request-options', {
      './log-request-options': logRequestOptionsStub
    });
  });

  it('is a function', function() {
    expect(getRequestOptions).to.be.a('function');
  });

  it('builds the request options based on the available options', function() {
    expect(getRequestOptions(optionsStub)).to.deep.equal({
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      method: 'GET',
      json: true,
      timeout: 1000,
      resolveWithFullResponse: true,
      rejectUnauthorized: true
    });
  });

  it('provides a default value for the timeout', function() {
    optionsStub.timeout = null;
    expect(getRequestOptions(optionsStub)).to.deep.equal({
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      method: 'GET',
      json: true,
      timeout: 25000,
      resolveWithFullResponse: true,
      rejectUnauthorized: true
    });
  });

  it('sets the headers, querystring and body if available', function() {
    expect(getRequestOptions(Object.assign(optionsStub, {
      body: 'body',
      headers: 'headers',
      queryString: 'querystring'
    }))).to.deep.equal({
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      method: 'GET',
      json: true,
      timeout: 1000,
      body: 'body',
      headers: 'headers',
      qs: 'querystring',
      resolveWithFullResponse: true,
      rejectUnauthorized: true
    });
  });
});
