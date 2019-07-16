'use strict';

module.exports = (k = '', attributes = {}) =>
  Object.keys(attributes).includes(k);
