'use strict';

const minimatch = require('minimatch');
const runSequence = require('run-sequence');
const replace = require('gulp-replace');
const autoprefixer = require('autoprefixer');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const fs = require('fs-extra');
const imagemin = require('gulp-imagemin');
const { obj: map } = require('through2');
const merge = require('merge-stream');
const ospath = require('path');
const path = ospath.posix;
const postcss = require('gulp-postcss');
const postcssCalc = require('postcss-calc');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const postcssVar = require('postcss-custom-properties');
const uglify = require('gulp-uglify');
const vfs = require('vinyl-fs');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const sassDir = 'stylesheets/**/*.scss';
const sassSrc = 'stylesheets/index.scss';
const sassDist = '_theme/stylesheets';

module.exports = (src, dest, preview) => {
  const opts = { base: src, cwd: src };
  const sourcemaps = preview || process.env.SOURCEMAPS === 'true';

  // const postcssPlugins = [
  //   postcssImport,
  //   postcssUrl([
  //     require('@csstools/postcss-sass'),
  //     {
  //       filter: '**/~typeface-*/files/*',
  //       url: (asset) => {
  //         const relpath = asset.pathname.substr(1);
  //         const abspath = require.resolve(relpath);
  //         const basename = ospath.basename(abspath);
  //         const destpath = ospath.join(dest, 'font', basename);
  //         if (!fs.pathExistsSync(destpath)) fs.copySync(abspath, destpath);
  //         return path.join('..', 'font', basename);
  //       },
  //     },
  //   ]),
  //   postcssVar({ preserve: preview ? 'preserve-computed' : false }),
  //   preview ? postcssCalc : () => {},
  //   autoprefixer,
  //   preview ? () => {} : cssnano({ preset: 'default' }),
  // ];

  const postcssPlugins = [require('@csstools/postcss-sass'), autoprefixer()];

  return merge([
    vfs.src('images/**/*.{svg,png}', opts).pipe(imagemin([
			imagemin.svgo({
				plugins: [
					{removeViewBox: false},
				]
			})
		])),
    vfs
      .src('scripts/+([0-9])-*.js', { ...opts, sourcemaps })
      // .pipe(uglify())
      .pipe(concat('scripts/site.js')),
    vfs.src('scripts/*.pack.js', opts),
    vfs.src('fonts/*.{woff,woff2}', opts),
    // vfs
    //   .src('stylesheets/index.scss')
    //   .pipe(sass())
    //   .pipe(autoprefixer),
    vfs
      .src('stylesheets/index.scss', { ...opts, sourcemaps })
      .pipe(postcss(postcssPlugins))
      .pipe(sass()),
    vfs.src('helpers/*.js', opts),
    vfs.src('layouts/*.hbs', opts),
    vfs.src('partials/*.hbs', opts),
  ]).pipe(vfs.dest(dest, { sourcemaps: sourcemaps && '.' }));
};
