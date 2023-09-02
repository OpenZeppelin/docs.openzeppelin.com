module.exports = function (attrs, opts) {
  return attrs.split(',').filter(a => a in opts.data.root.page.attributes).join(' ');
}
