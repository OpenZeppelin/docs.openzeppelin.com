(function () {
  'use strict'

  var sidrToggle = document.querySelector('.sidr-toggle'),
    sidrPanel = document.querySelector('#sidr')

  var toolbar = document.createElement('div')
  toolbar.classList.add('sidr-toolbar')

  // var backButton = document.createElement('button')
  // backButton.classList.add('sidr-back')
  // toolbar.appendChild(backButton)

  var closeButton = document.createElement('button')
  closeButton.classList.add('sidr-close')
  toolbar.appendChild(closeButton)

  var title = document.createElement('div')
  title.classList.add('sidr-title')
  toolbar.appendChild(title)

  sidrPanel.insertBefore(toolbar, sidrPanel.firstChild)

  // find(document, '#sidr .menu__link + .menu').forEach(function (menu) {
  //
  //   var submenuOpen = document.createElement('button')
  //   submenuOpen.classList.add('submenu__open')
  //   menu.parentNode.insertBefore(submenuOpen, menu)
  //
  //   submenuOpen.addEventListener('click', function () {
  //     sidrPanel.setAttribute('data-submenu', 'yes')
  //     menu.setAttribute('data-state', 'open')
  //   })
  // })

  sidrToggle.addEventListener('click', function (e) {
    sidrPanel.setAttribute('data-state', 'enabled')
    e.stopPropagation()
  })

  closeButton.addEventListener('click', function () {
    sidrPanel.removeAttribute('data-state')
  })

  sidrPanel.addEventListener('click', function (e) {
    e.stopPropagation()
  })
  window.addEventListener('click', function () {
    sidrPanel.removeAttribute('data-state')
  })

  //function find(from, selector) {
  //  return [].slice.call(from.querySelectorAll(selector))
  //}
})()
