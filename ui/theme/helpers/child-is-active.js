module.exports = function childIsActive(opts) {
  return this.url === opts.data.root.page.url || this.items?.some(i => childIsActive.call(i, opts));
}
