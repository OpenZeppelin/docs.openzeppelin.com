module.exports = function (attrs) {
  return attrs.split(',').filter(a => a in this.page.attributes).join(' ');
}
