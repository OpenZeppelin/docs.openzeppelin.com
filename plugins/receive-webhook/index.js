const yaml = require('js-yaml');
const multimatch = require('multimatch');
const fs = require('fs');

// https://docs.netlify.com/configure-builds/build-plugins/create-plugins/
module.exports = {
  onPreBuild: ({ utils }) => {
    const payload = getPayload();

    if (payload) {
      const { error, message } = processPayload(payload);

      if (error) {
        utils.build.cancelBuild(message);
      } else {
        utils.status.show({ summary: message });
      }
    }
  },
};

// Functions

function processPayload({ repository, ref }) {
  if (!repository || !ref) {
    return {
      error: 'bad-payload',
      message: 'Received webhook payload that is not a GitHub push event',
    };
  }

  const { branch, tag } = parseRef(ref);

  const source = getPlaybookSource(repository.full_name);

  if (!source) {
    return {
      error: 'not-content-source',
      message: `Update in ${repository.full_name} that does not match a content source`,
    };
  }

  const branchOrTag = branch || tag;

  if (!(branch ? matchBranch(branch, source.branches) : match(tag, source.tags))) {
    return {
      error: 'not-content-source',
      message: `Update in ${repository.full_name}@${branchOrTag} that does not match a content source`,
    };
  }

  return {
    message: `Update in ${repository.full_name}@${branchOrTag}`,
  };
}

function getPayload() {
  const hook_body = process.env.INCOMING_HOOK_BODY;
  if (!hook_body) return undefined;

  const payload = new URLSearchParams(hook_body).get('payload');
  if (!payload) {
    return {};
  } else {
    return JSON.parse(payload);
  }
}

function parseRef(ref) {
  if (ref.startsWith('refs/heads/')) {
    return { branch: ref.replace('refs/heads/', '') };
  }

  if (ref.startsWith('refs/tags/')) {
    return { tag: ref.replace('refs/tags/', '') };
  }

  return {};
}

function getPlaybookSource(repoFullName) {
  const playbook = yaml.safeLoad(fs.readFileSync('playbook.yml'));

  return playbook.content.sources.find(src => {
    try {
      // new URL(src.url) can fail if src.url is a file system path
      return new URL(src.url).pathname === ('/' + repoFullName);
    } catch (e) {
      return false;
    }
  });
}

// Antora 3 uses HEAD to mean the default remote branch. We assume it's either master or main.
function matchBranch(b, patterns) {
  if (!patterns) {
    patterns = [];
  }

  if (patterns.includes('HEAD')) {
    patterns = [...patterns, 'master', 'main'];
  }
  return match(b, patterns);
}

function match(str, patterns) {
  if (!patterns) {
    patterns = [];
  }

  return multimatch([str], patterns).length > 0;
}
