#!/usr/bin/env bash

set -o errexit

npm install --no-package-lock --no-audit

export PATH="$(npm bin):$PATH"

log() {
  echo "$*" >&2
}

log "Building UI bundle..."
cd ui
npm install --no-package-lock --no-audit
npm run bundle
cd ..
log "✓ Done"

log "Building site..."
antora --generator generator "$@"
log "✓ Done"

node latest-redirects.js
