module.exports = function (obj, selection, opts) {
  if (opts === undefined) {
    throw new Error('Must pass object and selection to #pick');
  }

  const keys = selection ? selection.split(/, */) : [];
  const result = {};
  for (const key of keys) {
    if (obj[key]) {
      result[key] = obj[key];
    }
  }
  return result;
}
