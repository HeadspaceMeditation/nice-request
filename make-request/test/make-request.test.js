/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0, no-magic-numbers: 0 */
'use strict';
const proxyquire = require('proxyquire');

describe('nice-request/make-request/index', function() {
  let makeRequest;
  let rpStub;
  let getRequestOptionsStub;
  let getRequestOptionsResult;
  let buildTagStub;
  let buildCountTagStub;
  let buildErrorResult;
  let buildErrorStub;
  let rpResults;
  let optionsStub;

  beforeEach(function() {
    buildErrorResult = new Error('build-error');
    buildErrorStub = sinon.stub().returns(buildErrorResult);
    buildTagStub = sinon.stub().returns('tag');
    buildCountTagStub = sinon.stub().returnsArg(1);
    getRequestOptionsResult = {b: 2};
    getRequestOptionsStub = sinon.stub().returns(getRequestOptionsResult);
    rpResults = {a: 1};
    rpStub = sinon.stub().resolves(rpResults);
    optionsStub = {
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      metricTag: 'test_request',
      method: 'GET',
      log: {
        info: sinon.spy()
      }
    };

    makeRequest = proxyquire('../index', {
      'request-promise': rpStub,
      './get-request-options': getRequestOptionsStub,
      './build-tag': buildTagStub,
      './build-count-tag': buildCountTagStub,
      './build-error': buildErrorStub
    });
  });

  it('is a function', function() {
    expect(makeRequest).to.be.a('function');
  });

  it('returns a promise fulfilled with the request promise results', function() {
    return expect(makeRequest(optionsStub))
      .to.eventually.equal(rpResults);
  });

  it('throws if a metricTag is not defined', function() {
    optionsStub.metricTag = null;
    expect(function() {
      makeRequest(optionsStub);
    }).to.throw(TypeError);
  });

  it('calls the logger on success', function() {
    return makeRequest(optionsStub).then(() => {
      expect(optionsStub.log.info).to.have.been.calledWith({message: 'tag', exception: sinon.match.string});
    });
  });

  it('stops the timer on error', function() {
    rpStub.rejects('error');
    return makeRequest(optionsStub).catch(() => {
      expect(optionsStub.log.info).to.have.been.calledWith({message: 'tag', exception: sinon.match.string});
    });
  });

  it('does not call logger when none is supplied', function() {
    optionsStub.log = null;
    expect(makeRequest(optionsStub)).to.be.fulfilled;
  });

  it('catches error and build a new one from it', function() {
    const reason = new Error('cause');
    rpStub.rejects(reason);
    return makeRequest(optionsStub).catch(error => {
      expect(error).to.equal(buildErrorResult);
      expect(buildErrorStub).to.have.been.calledWithExactly(optionsStub, reason);
    });
  });

  it('throws an error when an errCond is present but a maxTries is not', function() {
    optionsStub.errCond = error => error.message === 'some value';
    expect(function() {
      makeRequest(optionsStub);
    }).to.throw(TypeError);
  });

  it('retries a request when errCond and maxTries are passed via request options', function() {
    optionsStub.errCond = error => error.message === 'cause';
    optionsStub.maxTries = 5;
    const reason = new Error('cause');
    rpStub.rejects(reason);
    return makeRequest(optionsStub).catch(error => {
      expect(rpStub).callCount(5);
      expect(error.message).to.equal('build-error');
    });
  });
});
