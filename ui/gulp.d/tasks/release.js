'use strict';

const path = require('path');
const github = require('@octokit/rest')();

module.exports = async ({ owner, repo, token, dest }) => {
  github.authenticate({ type: 'token', token });

  const { data: latestRelease } = await github.repos.getLatestRelease({
    owner,
    repo,
  });
  const nextVersion = extractVersion(latestRelease.name);
  const releasePackageName = `${repo}-${nextVersion}.zip`;
  const localPackageName = `${repo}-local.zip`;

  const { data: release } = await github.repos.createRelease({
    owner,
    repo,
    tag_name: nextVersion,
    name: nextVersion,
  });

  return github.repos.uploadAsset({
    owner,
    repo,
    id: release.id,
    filePath: path.join(dest, localPackageName),
    name: releasePackageName,
  });
};

function extractVersion(releaseName) {
  const [v, currentVersionString] = /v(\d+)/.exec(releaseName) || [];
  const currentVersionNumber = Number(currentVersionString);
  const nextVersion = `v${currentVersionNumber + 1}`;

  return nextVersion;
}
