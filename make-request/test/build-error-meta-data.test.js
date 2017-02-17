/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0 */
'use strict';
const proxyquire = require('proxyquire');

describe('nice-request/make-request/build-error-meta-data', function() {
  let buildErrorMetaData;
  let buildTagStub;
  let setStackResults;
  let setStackStub;
  let optionsStub;
  let errorStub;

  beforeEach(function() {
    setStackResults = {message: 'message'};
    setStackStub = sinon.stub().returns(setStackResults);
    buildTagStub = sinon.stub().returns('tag');
    optionsStub = {
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      metricTag: 'test_request',
      method: 'GET'
    };

    errorStub = Object.assign(new Error('outer error'), {
      statusCode: 401,
      error: {
        message: 'error cause',
        code: 'error-code',
        detail: 'error detail',
        extra: 'extra info'
      }
    });

    buildErrorMetaData = proxyquire('../build-error-meta-data', {
      './build-tag': buildTagStub,
      './set-stack': setStackStub
    });
  });

  it('is a function', function() {
    expect(buildErrorMetaData).to.be.a('function');
  });

  it('returns the results from set stack', function() {
    expect(buildErrorMetaData(optionsStub, errorStub)).to.equal(setStackResults);
    expect(setStackStub).to.have.been.calledWithExactly({
      message: 'error cause',
      niceRequestTag: 'tag',
      niceRequestOptions: {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        method: 'GET'
      },
      extra: 'extra info'
    }, errorStub);
  });

  it('uses the metadata only if no inner error is available', function() {
    delete errorStub.error;
    buildErrorMetaData(optionsStub, errorStub);
    expect(setStackStub).to.have.been.calledWithExactly({
      niceRequestTag: 'tag',
      niceRequestOptions: {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        method: 'GET'
      }
    }, errorStub);
  });
});
