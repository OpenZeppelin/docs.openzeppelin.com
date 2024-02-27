#!/usr/bin/env sh

set -o xtrace -o errexit

log() {
  echo "$*" >&2
}

if [ -n "${NETLIFY:+x}" ]; then
  : ${NETLIFY_BUILD_BASE="/opt/build"}
  NETLIFY_CACHE_DIR="$NETLIFY_BUILD_BASE/cache"
  export XDG_CACHE_HOME="$NETLIFY_CACHE_DIR/xdg"

  if [ "$CONTEXT" != "production" ]; then
    export URL="$DEPLOY_PRIME_URL"
  fi

  # TODO: can we use a local config?
  node_gyp_cache="$(yarn -s node-which node-gyp-cache)"
  yarn config set node_gyp "$node_gyp_cache"
fi

## Antora

antora --stacktrace "$@"

## Redirections

node scripts/latest-redirects.js

## Headers

sh scripts/custom_headers.sh
