#!/usr/bin/env bash

export PATH="$(npm bin):$PATH"

if ! [ -f ui/build/oz-docs-ui.zip ]; then
  cd ui
  npm ci
  npm run bundle
  cd ..
fi

antora --generator generator "$@"
