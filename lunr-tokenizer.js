// The tokenization used by lunr by default doesn't work well with code.
// We extend the set of characters considered separators to include
// parentheses and commas.

const separator = /[\s\-(),]+/;

module.exports.separator = separator;

module.exports.register = () => {
  const lunr = require('lunr');
  lunr.tokenizer.separator = separator;
};
