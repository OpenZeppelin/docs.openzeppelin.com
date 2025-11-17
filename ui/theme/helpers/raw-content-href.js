module.exports = function (opts) {
  if (!opts.data.root.page.editUrl) return "";
  return opts.data.root.page.editUrl
    .replace(/\/$/, "")
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/edit/", "/refs/heads/");
};
