(function () {
  'use strict'

  var sidrToggle = document.querySelector('.sidr-toggle'),
    sidrPanel = document.querySelector('#sidr'),
    mainContent = document.querySelector('.main'),
    closeMenuButton = document.querySelector('.close-menu-btn')

  var sidrCollapse = document.querySelectorAll('.collapsible')

  sidrToggle.addEventListener('click', function (e) {
    openNav()
    sidrPanel.classList.toggle('active')
  })

  closeMenuButton.addEventListener('click', function (e) {
    closeNav()
    sidrPanel.classList.toggle('active')
  })

  function openNav() {
    sidrPanel.style.minWidth = '100vw';
    mainContent.style.display = 'none';
  }

  function closeNav() {
    sidrPanel.style.minWidth = '0';
    mainContent.style.display = 'block';
  }

  sidrCollapse.forEach(function (o) {
    o.addEventListener('click', function (e) {
      this.classList.toggle('active')
      var dropdownContent = this.nextElementSibling
      if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
      } else {
        dropdownContent.style.display = 'none';
      }
    })
  })
})()
