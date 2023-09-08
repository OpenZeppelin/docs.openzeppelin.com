module.exports = function (section, opts) {
  const collapse = opts.data.root.page.attributes['sidebar-collapse-default'];
  return typeof collapse === 'string' ? collapse.split(/\s*,\s*/).includes(section) : !!collapse;
}
