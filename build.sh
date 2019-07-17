#!/usr/bin/env bash

export PATH="$(npm bin):$PATH"

log() {
  echo "$*" >&2
}

if ! [ -f ui/build/oz-docs-ui.zip ]; then
  log "Building UI bundle..."
  cd ui
  npm ci
  npm run bundle
  cd ..
  log "✓ Done"
fi

log "Building site..."
antora --generator generator "$@"
log "✓ Done"
