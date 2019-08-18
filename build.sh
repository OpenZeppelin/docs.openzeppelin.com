#!/usr/bin/env bash

set -o errexit

npm install --no-package-lock --no-audit

if [ -n "$INCOMING_HOOK_BODY" ]; then
  # will exit with an error and thus abort the deploy
  # unless the webhook is an update to a content source
  node receive-webhook.js
fi

export PATH="$(npm bin):$PATH"

log() {
  echo "$*" >&2
}

log "Building UI bundle..."
cd ui
npm install --no-audit
npm run bundle
cd ..
log "✓ Done"

log "Building site..."
antora --generator generator "$@"
log "✓ Done"

node latest-redirects.js
