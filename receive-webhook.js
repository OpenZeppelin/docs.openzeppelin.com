const yaml = require('js-yaml');
const multimatch = require('multimatch');
const fs = require('fs');

const { repository, ref } = getPayload();

if (!repository || !ref) {
  throw new Error('Webhook payload is not a GitHub push event');
}

const { branch, tag } = parseRef(ref);

const source = getPlaybookSource(repository.full_name);

if (!source) {
  throw new Error('Repository does not match a content source');
}

if (!(match(branch, source.branches) || match(tag, source.tags))) {
  throw new Error('Branch or tag does not match a content source');
}

process.exit(0);


// Functions

function getPayload() {
  const hook_body = process.env.INCOMING_HOOK_BODY;
  const payload = new URLSearchParams(hook_body).get('payload');

  if (!hook_body || !payload) {
    return {};
  }

  return JSON.parse(payload);
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

function match(str, patterns = []) {
  return multimatch([str], patterns).length > 0;
}
