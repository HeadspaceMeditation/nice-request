/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0 */
'use strict';
const nock = require('nock');
const NiceError = require('nice-http-error');
const niceReq = require('./../nice-request');

const SUCCESS = 200;
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

describe('nice-request', function() {
  let loggerStub;
  let projectTag;

  beforeEach(function() {
    loggerStub = {
      info: sinon.spy()
    };
    projectTag = 'test-env.nice-test';

    niceReq.setup(loggerStub, projectTag);
  });

  context('request()', function() {
    it('uses the correct url', function() {
      const options = {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        metricTag: 'integration_test_request',
        method: 'GET'
      };
      const responseStub = {message: 'value', nested: [{value: 'nested value'}]};
      const scope = nock('https://www.my-nice-test.com')
        .get('/unit-testing-rocks')
        .reply(SUCCESS, responseStub);

      return (niceReq.request(options)).then(res => {
        scope.done();
        expect(res).to.deep.equal(responseStub);
      });
    });

    it('sends the correct payload', function() {
      const options = {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        metricTag: 'integration_test_request',
        method: 'POST',
        body: {value: 'payload value', nested: [{value: 'nested value'}]}
      };

      const scope = nock('https://www.my-nice-test.com')
        .post('/unit-testing-rocks', options.body)
        .reply(SUCCESS);

      return (niceReq.request(options)).then(() => {
        scope.done();
      });
    });

    it('sends the correct querystring', function() {
      const options = {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        metricTag: 'integration_test_request',
        method: 'get',
        querystring: {a: 'a value', b: 'another value'}
      };

      const scope = nock('https://www.my-nice-test.com')
        .get('/unit-testing-rocks')
        .query(options.querystring)
        .reply(SUCCESS);

      return (niceReq.request(options)).then(() => {
        scope.done();
      });
    });

    it('handles error if a NiceError is returned from the request', function() {
      const options = {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        metricTag: 'integration_test_request',
        method: 'get'
      };

      const niceError = NiceError.create('test error', {
        detail: 'a nice error',
        code: 'test code',
        error: new Error('made up error')
      });

      const scope = nock('https://www.my-nice-test.com')
        .get('/unit-testing-rocks')
        .reply(BAD_REQUEST, niceError);

      return (niceReq.request(options)).catch(err => {
        scope.done();
        expect(err).to.be.instanceof(NiceError);
        expect(err).to.have.property('message', 'GET to https://www.my-nice-test.com/unit-testing-rocks failed: test error');
        expect(err).to.have.property('status', BAD_REQUEST);
      });
    });

    it('handles error if a plain text error is returned from the request', function() {
      const options = {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        metricTag: 'integration_test_request',
        method: 'get'
      };

      const responseError = 'plain text error message';

      const scope = nock('https://www.my-nice-test.com')
        .get('/unit-testing-rocks')
        .reply(BAD_REQUEST, responseError);

      return (niceReq.request(options)).catch(err => {
        scope.done();
        expect(err).to.be.instanceof(NiceError);
        expect(err).to.have.property('message', `GET to https://www.my-nice-test.com/unit-testing-rocks failed: 400 - "plain text error message"`);
        expect(err).to.have.property('status', BAD_REQUEST);
      });
    });

    it('handles errors in the request itself', function() {
      const options = {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        metricTag: 'integration_test_request',
        method: 'get'
      };

      const responseError = new Error('Request Error');

      const scope = nock('https://www.my-nice-test.com')
        .get('/unit-testing-rocks')
        .replyWithError(responseError);

      return (niceReq.request(options)).catch(err => {
        scope.done();
        expect(err).to.be.instanceof(NiceError);
        expect(err).to.have.property('message', 'GET to https://www.my-nice-test.com/unit-testing-rocks failed: Request Error');
        expect(err).to.have.property('status', INTERNAL_SERVER_ERROR);
      });
    });

    it('retries requests', function() {
      const maxTries = 5;
      const options = {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        metricTag: 'integration_test_request',
        method: 'get',
        maxTries,
        errCond: error => error.message === 'Error: Request Error'
      };

      const responseError = new Error('Request Error');

      const scope = nock('https://www.my-nice-test.com')
        .get('/unit-testing-rocks')
        .times(maxTries)
        .replyWithError(responseError);

      return (niceReq.request(options)).catch(err => {
        scope.done();
        expect(err).to.be.instanceof(NiceError);
        expect(err).to.have.property('message', 'GET to https://www.my-nice-test.com/unit-testing-rocks failed: Request Error');
        expect(err).to.have.property('status', INTERNAL_SERVER_ERROR);
      });
    });

    it('handles timeouts', function() {
      const options = {
        url: 'https://www.my-nice-test.com/unit-testing-rocks',
        metricTag: 'integration_test_request',
        method: 'get',
        timeout: 1000
      };

      const delay = 1100;

      const scope = nock('https://www.my-nice-test.com')
        .get('/unit-testing-rocks')
        .socketDelay(delay)
        .reply(SUCCESS);

      return (niceReq.request(options)).catch(err => {
        scope.done();
        expect(err).to.be.instanceof(NiceError);
        expect(err).to.have.property('message', 'GET to https://www.my-nice-test.com/unit-testing-rocks failed: ESOCKETTIMEDOUT');
        expect(err).to.have.property('code', 'ESOCKETTIMEDOUT');
        expect(err).to.have.property('status', INTERNAL_SERVER_ERROR);
      });
    });
  });
});
