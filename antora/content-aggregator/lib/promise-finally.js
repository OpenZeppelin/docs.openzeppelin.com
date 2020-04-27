'use strict'

if (typeof Promise.prototype.finally === 'function') {
  module.exports = (p, finalizer) => p.finally(finalizer)
} else {
  module.exports = (p, finalizer) =>
    p.then(
      (res) => Promise.resolve(finalizer()).then(() => res),
      (err) =>
        Promise.resolve(finalizer()).then(() => {
          throw err
        })
    )
}
