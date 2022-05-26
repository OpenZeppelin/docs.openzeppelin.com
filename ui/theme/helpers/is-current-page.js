function isCurrentPage(page, current) {
  if (page.url === current) {
    return true;
  } else {
    return page.items?.some(p => isCurrentPage(p, current));
  }
}

module.exports = function (opts) {
  return isCurrentPage(this, opts.data.root.page.url);
}
