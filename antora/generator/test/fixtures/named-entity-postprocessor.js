'use strict'

function namedEntityPostprocessor () {
  this.process((_, output) => output.replace(/&copy;/g, '&#169;'))
}

module.exports = (registry) => {
  registry.postprocessor(namedEntityPostprocessor)
}
