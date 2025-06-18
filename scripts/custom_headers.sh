#!/usr/bin/env sh

# This script will create a custom _headers file with security headers. Ref. for the CSP header: https://content-security-policy.com/examples/netlify/

build_dir='build/site'

# See ui/theme/partials/footer-scripts.hbs
# MATHJAX_SRC="'sha512-T8xxpazDtODy3WOP/c6hvQI2O9UPdARlDWE0CvH1Cfqc0TXZF6GZcEKL7tIR8VbfS/7s/J6C+VOqrD6hIo++vQ=='"

# For mermaid see antora extension in playbook.yml
# MERMAID_SHA="'sha256-ngwD7npzgdOyiiBYvC+uZflrJ6mr9Jvw+AuyKix4R18='"

input_text="/*
  Content-Security-Policy: script-src 'self' 'unsafe-inline' wizard.openzeppelin.com www.google-analytics.com www.googletagmanager.com $NETLIFY_IMAGES_CDN_DOMAIN cdn.redocly.com js.hs-scripts.com netlify-cdp-loader.netlify.app js.hsadspixel.net js.hsleadflows.net js.hs-analytics.net js.hubspot.com js.headleadflows.net js.hscollectedforms.net js.hs-banner.com *.jsdelivr.net no-cache.hubspot.com *.hs-sites.com static.hsappstatic.net *.usemessages.com *.hubspotusercontent00.net *.hubspot.net play.hubspotvideo.com cdn2.hubspot.net *.hscollectedforms.net *.hsleadflows.net *.hsforms.net *.hsforms.com *.hs-scripts.com *.hubspotfeedback.com feedback.hubapi.com;"

echo "$input_text" > "$build_dir/_headers"

echo "Content-Security-Policy updated and saved to _headers file."
