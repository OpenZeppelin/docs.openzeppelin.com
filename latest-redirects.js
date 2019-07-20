#!/usr/bin/env node

// Generates a Netlify _redirects file which sets up redirections to the
// latest version of each project.

const fs = require('fs');
const glob = require('glob');
const sv = require('semver');

const components = glob.sync('sitemap-*.xml', { cwd: 'build/site' })
  .map(c => c.match(/sitemap-(.*)\.xml/)[1]);

let redirects = '';

for (const comp of components) {
  const versions = glob.sync('*/', { cwd: `build/site/${comp}` })
    .map(c => c.replace(/\/$/, ''))
    .sort((a, b) => sv.rcompare(sv.coerce(a), sv.coerce(b)));

  if (versions.length > 0) {
    const latest = versions[0];
    redirects += `/${comp} /${comp}/${latest} 302\n`;
  }
}

fs.writeFileSync('build/site/_redirects', redirects);
