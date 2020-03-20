#!/usr/bin/env node

// Generates a Netlify _redirects file which sets up redirections to the
// latest version of each component (i.e. documented project).

const fs = require('fs');
const glob = require('glob');
const sv = require('semver');

// Get the names of all components.
const components = glob.sync('sitemap-*.xml', { cwd: 'build/site' })
  .map(c => c.match(/sitemap-(.*)\.xml/)[1]);

let redirects = fs.readFileSync('_redirects');

for (const comp of components) {
  // Get all the versions of this component.
  const versions = glob.sync('*/', { cwd: `build/site/${comp}` })
    // Remove trailing slash.
    .map(c => c.replace(/\/$/, ''))
    // Remove anything that doesn't look like a version.
    .filter(c => sv.coerce(c) !== null)
    // Remove prereleases: these will have a dash, e.g. '3.x-rc.0'
    .filter(c => !c.includes('-'))
    // Sort from latest to oldest. Coerces each version into a valid semver
    // version because some component versions might be '2.x'.
    .sort((a, b) => sv.rcompare(sv.coerce(a), sv.coerce(b)));

  if (versions.length > 0) {
    const latest = versions[0];
    redirects += `/${comp}/* /${comp}/${latest}/:splat 302\n`;
  }
}

fs.writeFileSync('build/site/_redirects', redirects);
