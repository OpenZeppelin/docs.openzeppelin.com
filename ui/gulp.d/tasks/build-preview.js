'use strict';

const fs = require('fs');
const path = require('path');
const fileinclude = require('gulp-file-include');
const vfs = require('vinyl-fs');
const map = require('map-stream');
const merge = require('merge-stream');
const minimatch = require('minimatch');
const handlebars = require('handlebars');
const requireFromString = require('require-from-string');
const asciidoctor = require('asciidoctor.js')();
const yaml = require('js-yaml');

const ASCIIDOC_ATTRIBUTES = {
  experimental: '',
  icons: 'font',
  sectanchors: '',
  'source-highlighter': 'highlight.js',
};

module.exports = async (src, dest, destTheme, previewSrcDir) => {
  const relativeThemePath = path.relative(dest, destTheme);

  const [sampleUiModel, layoutsIndex] = await Promise.all([
    loadSampleUiModel(previewSrcDir),
    compileLayouts(src),
    registerPartials(src),
    registerHelpers(src),
  ]);

  vfs
    .src([path.join(previewSrcDir, '**/*.adoc')])
    .pipe(
      map((file, next) => {
        const siteRootPath = path.relative(path.dirname(file.path), path.resolve(previewSrcDir));
        const uiModel = { ...sampleUiModel };
        uiModel.page = { ...uiModel.page };
        uiModel.siteRootPath = siteRootPath;
        uiModel.siteRootUrl = path.join(siteRootPath, 'index.html');
        uiModel.uiRootPath = path.join(siteRootPath, destTheme);
        if (file.stem === '404') {
          uiModel.page = { layout: '404', title: 'Page Not Found' };
        } else {
          const doc = asciidoctor.load(file.contents, { safe: 'safe', attributes: ASCIIDOC_ATTRIBUTES });
          uiModel.page.attributes = Object.entries(doc.getAttributes())
            .filter(([name, val]) => name.startsWith('page-'))
            .reduce((accum, [name, val]) => {
              accum[name.substr(5)] = val
              return accum
            }, {});
          uiModel.page.layout = doc.getAttribute('page-layout', 'default');
          uiModel.page.title = doc.getDocumentTitle();
          uiModel.page.contents = Buffer.from(doc.convert());
        }
        file.extname = '.html';
        uiModel.page.url = '/' + file.relative;
        file.contents = Buffer.from(layoutsIndex[uiModel.page.layout](uiModel));
        next(null, file);
      })
    )
    .pipe(vfs.dest(dest));
};

function loadSampleUiModel(src) {
  return yaml.safeLoad(fs.readFileSync(path.join(src, 'ui-model.yml'), 'utf8'));
}

function registerPartials(src) {
  return new Promise((resolve, reject) => {
    vfs
      .src(['partials/*.hbs'], { base: src, cwd: src })
      .pipe(
        fileinclude({
          prefix: '@@',
          basepath: path.resolve(src, '..'),
        })
      )
      .pipe(
        map((file, next) => {
          handlebars.registerPartial(file.stem, file.contents.toString());
          next(null, file);
        })
      )
      .on('error', reject)
      .on('end', resolve);
  });
}

function registerHelpers(src) {
  return new Promise((resolve, reject) => {
    vfs
      .src(['helpers/*.js'], { base: src, cwd: src })
      .pipe(
        map((file, next) => {
          const helperFunction = requireFromString(file.contents.toString());
          handlebars.registerHelper(file.stem, helperFunction);
          next(null, file);
        })
      )
      .on('error', reject)
      .on('end', resolve);
  });
}

function compileLayouts(src) {
  const layoutsIndex = {};
  return new Promise((resolve, reject) => {
    vfs
      .src('layouts/*.hbs', { base: src, cwd: src })
      .pipe(
        map((file, next) => {
          layoutsIndex[file.stem] = handlebars.compile(
            file.contents.toString(),
            { preventIndent: true }
          );
          next(null, file);
        })
      )
      .on('error', reject)
      .on('end', () => resolve(layoutsIndex));
  });
}
