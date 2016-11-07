/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0, no-magic-numbers: 0 */
'use strict';
const buildCountTag = require('../build-count-tag');

describe('nice-request/make-request/build-count-tag', function() {
  it('is a function', function() {
    expect(buildCountTag).to.be.a('function');
  });

  it('builds a valid tag', function() {
    expect(buildCountTag({
      url: 'https://www.my-nice-test.com/unit-testing-rocks',
      projectTag: 'project'
    }, 200)).to.equal('project.www_my-nice-test_com.200');
  });
});
