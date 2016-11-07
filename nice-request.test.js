/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0 */
'use strict';
const proxyquire = require('proxyquire');

describe('nice-request', function() {
  let niceReq;
  let loggerStub;
  let projectTagStub;
  let makeRequestStub;
  let makeRequestResults;
  let optionsStub;

  beforeEach(function() {
    loggerStub = {
      info: sinon.spy()
    };
    projectTagStub = 'test-env.nice-test';

    makeRequestResults = {a: 1};
    makeRequestStub = sinon.stub().resolves(makeRequestResults);
    optionsStub = {
      method: 'POST'
    };

    niceReq = proxyquire('./nice-request', {
      './make-request': makeRequestStub
    });
  });

  context('setup()', function() {
    it('is a function', function() {
      expect(niceReq.setup).to.be.a('function');
    });

    it('is callable and returns nothing', function() {
      expect(niceReq.setup()).to.be.undefined;
    });
  });

  context('request()', function() {
    beforeEach(function() {
      niceReq.setup(loggerStub, projectTagStub);
    });

    it('is a function', function() {
      expect(niceReq.request).to.be.a('function');
    });

    it('fulfills to makeRequest result', function() {
      return expect(niceReq.request(optionsStub))
        .to.eventually.equal(makeRequestResults);
    });

    it('calls make the request including the setup values', function() {
      niceReq.request(optionsStub);
      expect(makeRequestStub).to.have.been.calledWithExactly({
        method: 'POST',
        log: loggerStub,
        projectTag: projectTagStub
      });
    });

    it('defaults options method to GET', function() {
      optionsStub.method = null;
      niceReq.request(optionsStub);
      expect(makeRequestStub).to.have.been.calledWithExactly({
        method: 'GET',
        log: loggerStub,
        projectTag: projectTagStub
      });
    });
  });
});
