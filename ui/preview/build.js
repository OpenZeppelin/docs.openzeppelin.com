#!/usr/bin/env node

const { promisify } = require('util');
const globAsync = require('glob');
const glob = promisify(globAsync);
const rimraf = promisify(require('rimraf'));
const path = require('path');
const fs = require('fs').promises;
const asciidoctor = require('asciidoctor')();
const fsSync = require('fs');
const handlebars = require('handlebars');
const yaml = require('yaml');
const fromEntries = require('fromentries');

const themeDir = 'theme';
const previewDir = 'preview';
const previewPagesDir = path.join(previewDir, 'pages');
const previewPartialsDir = path.join(previewDir, 'partials');
const buildDir = path.join(previewDir, 'build');

const ASCIIDOC_ATTRIBUTES = {
  experimental: '',
  icons: 'font',
  sectanchors: '',
  'source-highlighter': 'highlight.js',
};

async function main() {
  const pages = await getPages();
  const render = await makeTemplate();
  const { makeModel, model } = await getUIModel();

  await fs.mkdir(buildDir, { recursive: true });
  const buildThemeDir = path.join(buildDir, model.site.ui.url);

  await fs.unlink(buildThemeDir).catch(() => {});
  await fs.symlink(path.relative(path.dirname(buildThemeDir), themeDir), buildThemeDir);

  for (const page of pages) {
    const pageModel = makeModel(page);
    const html = render(pageModel);
    const dest = path.join(buildDir, pageModel.page.url);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, html);
  }
}

async function getPages() {
  const pageFiles = await glob(path.join(previewPagesDir, '**/*.adoc'));

  const extension_registry = asciidoctor.Extensions.create();
  extension_registry.includeProcessor(function () {
    this.process(function (doc, reader, target, attrs) {
      const [_, file] = target.match(/partial\$(.*)/);
      const content = fsSync.readFileSync(path.join(previewPartialsDir, file), 'utf8');
      return reader.pushInclude(content, target, target, 1, attrs);
    });
  });

  return Promise.all(pageFiles.map(async f => {
    const source = await fs.readFile(f, 'utf8');
    const sourceWithLinks = source.replace('xref:contracts::index.adoc', 'link:/contracts/2.x');
    const doc = asciidoctor.load(sourceWithLinks, { extension_registry, safe: 'safe', attributes: ASCIIDOC_ATTRIBUTES })
    const attributes = fromEntries(
      Object.entries(doc.getAttributes())
        .filter(([k]) => k.startsWith('page-'))
        .map(([k, v]) => [k.replace('page-', ''), v])
    );
    return {
      attributes,
      layout: attributes.layout ?? 'default',
      relativeSrcPath: path.relative(previewPagesDir, f),
      title: doc.getDocumentTitle(),
      contents: doc.convert(),
    };
  }));
}

async function makeTemplate() {
  const h = handlebars.create();

  for (const partial of await glob(path.join(themeDir, 'partials/*'))) {
    const { name } = path.parse(partial);
    h.registerPartial(name, await fs.readFile(partial, 'utf8'));
  }

  for (const helper of await glob(path.join(themeDir, 'helpers/*'))) {
    const { name } = path.parse(helper);
    h.registerHelper(name, require(path.resolve(helper)));
  }

  const layout = await fs.readFile(path.join(themeDir, 'layouts/default.hbs'), 'utf8');
  return h.compile(layout);
}

async function getUIModel() {
  const model = yaml.parse(await fs.readFile(path.join(previewDir, 'model.yml'), 'utf8'));
  const makeModel = page => {
    const [componentName, ...componentPage] = page.relativeSrcPath.split(path.sep);
    const component = model.site.components[componentName] ?? model.site.components.ROOT;
    const url = path.join('/', componentName, ...componentPage)
      .replace(path.extname(page.relativeSrcPath), '.html');
    const siteRootPath = path.relative(page.relativeSrcPath, '');
    const siteRootUrl = path.join(siteRootPath, 'index.html');
    const uiRootPath = path.join(siteRootPath, model.site.ui.url);
    return {
      ...model,
      siteRootPath,
      siteRootUrl,
      uiRootPath,
      page: {
        ...model.page,
        ...page,
        url,
        component,
        componentVersion: component.latestVersion,
      },
    };
  };
  return { makeModel, model };
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
