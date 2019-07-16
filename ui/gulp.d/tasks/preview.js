'use strict';

const fs = require('fs');

const browserSync = require('browser-sync');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');

const watchedDirs = [
  '../../src/helpers',
  '../../src/images',
  '../../src/layouts',
  '../../src/partials',
  '../../src/preview-site',
  '../../src/scripts',
  '../../src/stylesheets',
];

module.exports = ({ dest, port }) => {
	console.log('Ahre')
  browserSync({
    files: dest,
    ghostMode: false,
    notify: false,
    open: false,
    port,
    reloadDelay: 200,
    reloadDebounce: 200,
    ui: false,
    server: dest,
  });

  const build = debounce(buildCallback, 300)
  const watcher = chokidar.watch(watchedDirs, { ignoreInitial: true });
  watcher.on('all', () => build());
};
