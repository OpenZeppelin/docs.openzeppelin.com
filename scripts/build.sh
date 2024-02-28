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
fi

## Antora

antora --stacktrace "$@"

## Redirections

node scripts/latest-redirects.js

## Headers

sh scripts/custom_headers.sh
