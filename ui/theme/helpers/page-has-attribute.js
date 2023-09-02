module.exports = function (attr, opts) {
  return attr in opts.data.root.page.attributes;
}
