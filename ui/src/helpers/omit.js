module.exports = function (obj, selection, opts) {
  if (opts === undefined) {
    throw new Error('Must pass object and selection to #omit');
  }

  const keys = selection ? selection.split(/, */) : [];
  const result = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}