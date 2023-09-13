#!/usr/bin/env sh

# This script will create a custom _headers file with security headers. Ref. for the CSP header: https://content-security-policy.com/examples/netlify/

buildDir='build/site'

input_text="/*
  Content-Security-Policy: script-src 'self' 'unsafe-inline' www.googletagmanager.com $NETLIFY_IMAGES_CDN_DOMAIN js.hs-scripts.com netlify-cdp-loader.netlify.app js.hsadspixel.net js.hsleadflows.net js.hs-analytics.net js.hubspot.com js.headleadflows.net js.hscollectedforms.net js.hs-banner.com no-cache.hubspot.com *.hs-sites.com static.hsappstatic.net *.usemessages.com *.hubspotusercontent00.net *.hubspot.net play.hubspotvideo.com cdn2.hubspot.net *.hscollectedforms.net *.hsleadflows.net *.hsforms.net *.hsforms.com *.hs-scripts.com *.hubspotfeedback.com feedback.hubapi.com;"

echo "$input_text" > "$buildDir/_headers"

echo "Content-Security-Policy updated and saved to _headers file."
