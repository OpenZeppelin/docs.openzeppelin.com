#!/usr/bin/env bash

set -o xtrace -o errexit

if [ -v INCOMING_HOOK_BODY ]; then
  # will exit with an error and thus abort the deploy
  # unless the webhook is an update to a content source
  node receive-webhook.js
fi

log() {
  echo "$*" >&2
}

if [ -v NETLIFY ]; then
  : ${NETLIFY_BUILD_BASE="/opt/build"}

  NETLIFY_CACHE_DIR="$NETLIFY_BUILD_BASE/cache"

  export XDG_CACHE_HOME="$NETLIFY_CACHE_DIR/xdg"

  nicer_node_gyp="$(yarn -s which nicer-node-gyp)"
  yarn config set node_gyp "$nicer_node_gyp"
  npm config set node_gyp "$nicer_node_gyp"
fi

## UI Bundle

yarn --cwd ui bundle

## Antora

antora --generator generator --stacktrace "$@"

## Redirections

node latest-redirects.js
