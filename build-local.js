#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const proc = require('child_process');
const yaml = require('js-yaml');
const findUp = require('find-up');

const playbook = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'playbook.yml')));

const gitDir = path.dirname(findUp.sync('.git', { type: 'directory' }));

playbook.content.sources = [{
  url: gitDir,
  branches: 'HEAD',
  start_path: path.relative(gitDir, '.'),
}];

fs.writeFileSync('local-playbook.yml', yaml.safeDump(playbook));

proc.execFileSync('./node_modules/.bin/antora', ['--generator', 'generator', path.resolve('local-playbook.yml')], {
  cwd: __dirname,
})
