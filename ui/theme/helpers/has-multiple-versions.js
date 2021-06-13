'use strict';

module.exports = (component) =>
  component.versioned && component.versions.length > 1;
