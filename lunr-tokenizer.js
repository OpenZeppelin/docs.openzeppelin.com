// The tokenization used by lunr by default doesn't work well with code.
// We extend the set of characters considered separators to include
// parentheses and commas.

const path = require('path');
const fs = require('fs');

module.exports.register = () => {
  const lunr = require('lunr');
  lunr.tokenizer.separator = /[\s\-(),]+/;
  lunr.QueryLexer.termSeparator = lunr.tokenizer.separator;

  // The lunr source code is vendored into the UI, and tokenization for search results
  // is done client side, so we have to patch this file to fix tokenization too.
  const patch = `(function () { globalThis.lunr.tokenizer.separator = ${lunr.tokenizer.separator.toString()}; })();`

  const searchUiPath = path.join(
    path.dirname(require.resolve('@antora/lunr-extension/package.json')),
    'data/js/search-ui.js',
  );

  const searchUi = fs.readFileSync(searchUiPath, 'utf8');

  if (!searchUi.includes(patch)) {
    fs.writeFileSync(searchUiPath, searchUi + patch);
  }
};
