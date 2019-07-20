module.exports = function (obj, order, opts) {
  if (opts === undefined) {
    throw new Error('Must pass object and order to #sorted');
  }

  const keys = order ? order.split(/, */) : [];
  const allKeys = Object.keys(obj);
  const indexOf = k => (keys.indexOf(k) + 1) || (keys.length + 1);
  allKeys.sort((a, b) => indexOf(a) - indexOf(b));
  return allKeys.map(key => opts.fn(obj[key])).join('');
}
