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
      metricTag: 'test_request',
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
      metricTag: 'test_request',
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
      metricTag: 'test_request',
      headers: 'headers',
      qs: 'querystring',
      resolveWithFullResponse: true,
      rejectUnauthorized: true
    });
  });

  it('sets formData when available', function() {
    expect(getRequestOptions(Object.assign(optionsStub, {
      formData: 'someFormData',
      headers: 'headers'
    }))).to.deep.equal({
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      method: 'GET',
      json: true,
      timeout: 1000,
      metricTag: 'test_request',
      formData: 'someFormData',
      headers: 'headers',
      resolveWithFullResponse: true,
      rejectUnauthorized: true
    });
  });

  it('sets formData when available', function() {
    expect(getRequestOptions(Object.assign(optionsStub, {
      formData: 'someFormData',
      headers: 'headers'
    }))).to.deep.equal({
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      method: 'GET',
      json: true,
      timeout: 1000,
      metricTag: 'test_request',
      formData: 'someFormData',
      headers: 'headers',
      resolveWithFullResponse: true,
      rejectUnauthorized: true
    });
  });

  it('sets the encoding', function() {
    expect(getRequestOptions(Object.assign(optionsStub, {
      encoding: null,
    }))).to.deep.equal({
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      method: 'GET',
      json: false,
      encoding: null,
      timeout: 1000,
      metricTag: 'test_request',
      resolveWithFullResponse: true,
      rejectUnauthorized: true
    });
  });
});
