#!/usr/bin/env node

const JSZip = require('jszip');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

const themeDir = 'theme';

const zip = new JSZip();
const files = glob.sync(path.join(themeDir, '**'));
for (const file of files) {
  if (fs.statSync(file).isFile()) {
    zip.file(path.relative(themeDir, file), fs.readFileSync(file));
  }
}

zip.generateAsync({ type: 'nodebuffer' }).then(buf => {
  fs.writeFileSync('bundle.zip', buf);
});
