/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0 */
'use strict';
const proxyquire = require('proxyquire');

describe('nice-request/make-request/build-error', function() {
  let buildError;
  let buildErrorMetaDataResults;
  let buildErrorMetaDataStub;
  let niceErrorResult;
  let niceErrorStub;
  let optionsStub;
  let errorStub;

  beforeEach(function() {
    niceErrorResult = new Error('nice-http-error');
    niceErrorStub = {
      create: sinon.stub().returns(niceErrorResult)
    };
    buildErrorMetaDataResults = {a: 1};
    buildErrorMetaDataStub = sinon.stub().returns(buildErrorMetaDataResults);
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
        detail: 'error detail'
      }
    });

    buildError = proxyquire('../build-error', {
      'nice-http-error': niceErrorStub,
      './build-error-meta-data': buildErrorMetaDataStub
    });
  });

  it('is a function', function() {
    expect(buildError).to.be.a('function');
  });

  it('builds a nice error with the given metadata', function() {
    expect(buildError(optionsStub, errorStub))
      .to.equal(niceErrorResult);
    expect(niceErrorStub.create).to.have.been.calledWithExactly(
      'GET to https://www.my-nice-test.com/unit-testing-rocks failed: error cause',
      {
        detail: 'error detail',
        code: 'error-code',
        status: 401,
        error: buildErrorMetaDataResults
      }
    );
  });

  it('builds the message when error inner property has no message', function() {
    delete errorStub.error.message;
    buildError(optionsStub, errorStub);
    expect(niceErrorStub.create)
      .to.have.been.calledWith('GET to https://www.my-nice-test.com/unit-testing-rocks failed: outer error');
  });
});
