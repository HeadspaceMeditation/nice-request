/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0 */
'use strict';
const buildTag = require('../build-tag');

describe('nice-request/make-request/build-tag', function() {
  it('is a function', function() {
    expect(buildTag).to.be.a('function');
  });

  it('builds a valid tag', function() {
    expect(buildTag({
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      projectTag: 'project',
      method: 'GET',
      metricTag: 'test_request'
    })).to.equal('project.www_my-nice-test_com.test_request.GET');
  });
});
