module.exports = (ctx) => {
  let title = [ctx.data.root.site.title];
  const { page } = ctx.data.root;
  if (page?.component?.name !== 'ROOT' && page?.component?.title) {
    title.unshift(page.component.title);
  }
  if (page?.title) {
    title.unshift(page.title);
  }
  return title.join(' - ');
};
