(function () {
  'use strict';

  const sidrToggle = document.querySelector('.sidr-toggle');
  const sidrPanel = document.querySelector('#sidr');
  const mainContent = document.querySelector('.main');
  const closeMenuButton = document.querySelector('.close-menu-btn');

  sidrToggle.addEventListener('click', function (e) {
    sidrPanel.classList.toggle('active');
  });

  closeMenuButton.addEventListener('click', function (e) {
    sidrPanel.classList.toggle('active');
  });

  const collapseToggles = document.querySelectorAll('.collapse-toggle');

  collapseToggles.forEach(function (o) {
    o.addEventListener('click', function (e) {
      this.classList.toggle('active');
    });
  });
})();
