#!/usr/bin/env sh

set -o xtrace -o errexit

log() {
  echo "$*" >&2
}

if [ -n "${NETLIFY:+x}" ]; then
  : ${NETLIFY_BUILD_BASE="/opt/build"}

  NETLIFY_CACHE_DIR="$NETLIFY_BUILD_BASE/cache"

  export XDG_CACHE_HOME="$NETLIFY_CACHE_DIR/xdg"

  # TODO: can we use a local config?
  node_gyp_cache="$(yarn -s which node-gyp-cache)"
  yarn config set node_gyp "$node_gyp_cache"
  npm config set node_gyp "$node_gyp_cache"
fi

## Antora

antora --generator generator --stacktrace "$@"

## Redirections

node scripts/latest-redirects.js
