'use strict'

module.exports = (needle, haystack) => {
  if (haystack == undefined) {
    return false;
  } else if (typeof haystack === 'string') {
    return haystack.split(/, */).includes(needle);
  } else if (typeof haystack === 'object') {
    return needle in haystack;
  } else {
    throw new Error('unknown type ' + typeof haystack);
  }
}
