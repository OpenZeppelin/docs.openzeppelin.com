const fs = require('fs');
const H = require('handlebars');

module.exports = (icon, { hash }) => {
  const klass = hash.class ?? '';
  const svg = fs.readFileSync(require.resolve(`heroicons/solid/${icon}.svg`), 'utf8');
  return new H.SafeString(svg.replace('svg', `svg class="icon ${klass}"`));
}
