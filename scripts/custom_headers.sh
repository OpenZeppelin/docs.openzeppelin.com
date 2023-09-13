#!/usr/bin/env sh

buildDir='build/site'

input_text="/*
  Content-Security-Policy = \"script-src 'self' *.googletagmanager.com $NETLIFY_IMAGES_CDN_DOMAIN js.hs-scripts.com js.hsadspixel.net js.hsleadflows.net js.hsleadflows.net js.hs-analytics.net js.hubspot.com js.headleadflows.net js.hscollectedforms.net js.hs-banner.com;\""

echo "$input_text" > "$buildDir/_headers"

echo "Content-Security-Policy updated and saved to _headers file."
