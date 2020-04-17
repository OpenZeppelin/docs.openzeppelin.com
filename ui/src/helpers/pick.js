module.exports = function (obj, selection, opts) {
  if (opts === undefined) {
    throw new Error('Must pass object and selection to #pick');
  }

  const keys = selection ? selection.split(/, */) : [];
  return keys.reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});
}
