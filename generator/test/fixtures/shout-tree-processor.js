'use strict'

function shoutTreeProcessor () {
  this.process((doc) => {
    const vol = parseInt(doc.getAttribute('volume', 1))
    doc.findBy({ context: 'paragraph' }).forEach((p) => {
      p.lines = p.lines.map((l) => l.replace(/\.(?= |$)/g, '!'.repeat(vol)))
    })
  })
}

function register (registry) {
  registry.treeProcessor(shoutTreeProcessor)
}

module.exports = shoutTreeProcessor
module.exports.register = register
