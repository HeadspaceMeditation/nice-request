/* eslint no-unused-expressions: 0, init-declarations: 0, prefer-arrow-callback: 0, func-names: 0 */
'use strict';
const setStack = require('../set-stack');

describe('nice-request/make-request/set-stack', function() {
  it('is a function', function() {
    expect(setStack).to.be.a('function');
  });

  it('sets the stack property as not enumerable', function() {
    const target = {};
    const source = new Error('source error');
    expect(setStack(target, source)).to.have.property('stack', source.stack);
    expect(target.propertyIsEnumerable('stack')).to.equal(false);
  });
});
