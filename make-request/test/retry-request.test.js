/* eslint no-unused-expressions: 0, global-require: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0, no-magic-numbers: 0 */
'use strict';

describe('nice-request/make-request/retry-request', function() {
  let requestStub;
  let errCondStub;
  let retryRequest;
  let resolvedValue;

  beforeEach(function() {
    resolvedValue = {};
    requestStub = sinon.stub().returns(Promise.resolve(resolvedValue));
    errCondStub = err => err.message === 'problems';

    retryRequest = require('../retry-request');
  });

  it('returns a fulfilled promise', function() {
    return expect(retryRequest(requestStub, errCondStub, 3, 0))
    .to.eventually.equal(resolvedValue);
  });

  it('stops retrying when attemps = max tries', function() {
    requestStub = sinon.stub().returns(Promise.reject(new Error('problems')));
    return retryRequest(requestStub, errCondStub, 3).catch(error => {
      expect(requestStub).to.be.calledThrice;
    });
  });

  it('stops retrying when errCond evaluates false', function() {
    requestStub = sinon.stub();
    requestStub.onFirstCall().returns(Promise.reject(new Error('problems')));
    requestStub.onSecondCall().returns(Promise.reject(new Error('different problems')));
    return retryRequest(requestStub, errCondStub, 5).catch(error => {
      expect(error.message).to.equal('different problems');
      expect(requestStub).to.be.calledTwice;
    });
  });

  it('does not retry is no errCond is supplied', function() {
    requestStub = sinon.stub().returns(Promise.reject(new Error('problems')));
    return retryRequest(requestStub).catch(error => {
      expect(requestStub).to.be.called;
    });
  });
});
