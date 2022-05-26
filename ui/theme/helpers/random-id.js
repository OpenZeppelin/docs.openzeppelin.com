const crypto = require('crypto');

const map = new WeakMap();
const genId = () => crypto.randomBytes(8).toString('base64url');

module.exports = function ({ hash: { key } }) {
  if (key === undefined)  {
    return genId();
  } else {
    if (map.has(this)) {
      return map.get(this);
    } else {
      const id = genId();
      map.set(this, id);
      return id;
    }
  }
}
