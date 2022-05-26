module.exports = function isCurrentPage(page, opts) {
  if (page.url === opts.data.root.page.url) {
    return true;
  } else {
    return page.items?.some(p => isCurrentPage(p, opts));
  }
}
