'use strict';
/**
 * Sets stack as not enumerable property in the target object
 * @param {object} target target object to set the property on
 * @param {Error} source source error
 * @return {undefined}
 */

module.exports = (target, source) =>
  Object.defineProperty(target, 'stack', {
    configurable: true,
    enumerable: false,
    value: source.stack,
    writable: true
  });
