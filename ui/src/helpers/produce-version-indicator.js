'use strict';

module.exports = (component) =>
  component.versioned ? ` (${component.version.string})` : '';
