(() => {
  'use strict'

  var toolbar = document.querySelector('.toolbar')

  function querySect1 (el) {
    if (el.className === 'sect1') {
      return el
    }
    else if (el.nodeName !== 'ARTICLE') {
      return querySect1(el.parentNode)
    }
  }

  function queryStickyHeading (from) {
    var sect1 = querySect1(from)
    if (sect1) {
      return sect1.firstElementChild
    }
  }

  function isStickyHeading (candidate) {
    return candidate.nodeName === 'H2' && candidate.parentNode.className === 'sect1'
  }

  function jumpToAnchor (e) {
    if (e) {
      window.location.hash = '#' + this.id
      e.preventDefault()
    }
    var stickyHeading = queryStickyHeading(this)
    window.scrollTo(0, this.offsetTop - toolbar.offsetHeight - (stickyHeading ? stickyHeading.offsetHeight : 0))
  }

  function jumpToStickyHeading (e) {
    if (e) {
      window.location.hash = '#' + this.id
      e.preventDefault()
    }
    window.scrollTo(0, document.documentElement.scrollTop = this.parentNode.offsetTop - toolbar.offsetHeight)
  }

  window.addEventListener('load', function jumpOnLoad (hash, target) {
    if ((hash = window.location.hash) && (target = document.getElementById(hash.slice(1)))) {
      isStickyHeading(target) ? jumpToStickyHeading.bind(target)() : jumpToAnchor.bind(target)()
    }
    window.removeEventListener('load', jumpOnLoad)
  })

  Array.prototype.slice.call(document.querySelectorAll('.doc a[href^="#"]')).forEach(function (a) {
    var target = document.getElementById(a.hash.slice(1))
    if (target) {
      a.addEventListener('click', isStickyHeading(target) ? jumpToStickyHeading.bind(target) : jumpToAnchor.bind(target))
    }
  })
})();
