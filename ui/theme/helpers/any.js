'use strict'

module.exports = (collection, predicate) => {
  for (const key in collection) {
    if (collection[key][predicate]) {
      return true;
    }
  }
  return false;
}
