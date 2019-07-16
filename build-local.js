#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const proc = require('child_process');
const yaml = require('js-yaml');
const findUp = require('find-up');

const playbook = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'playbook.yml')));

const gitDir = path.dirname(findUp.sync('.git', { type: 'directory' }));

playbook.content.sources = [{
  url: __dirname,
  branches: 'HEAD',
}, {
  url: gitDir,
  branches: 'HEAD',
  start_path: path.relative(gitDir, '.'),
}];

const localPlaybookFile = path.resolve(__dirname, 'local-playbook.yml');
fs.writeFileSync(localPlaybookFile, yaml.safeDump(playbook));

proc.execFileSync('bash', ['./build.sh', localPlaybookFile], {
  cwd: __dirname,
  stdio: 'inherit',
});

console.log('Successfully built site!');
