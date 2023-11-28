(function () {
  'use strict';

  const sidrToggle = document.querySelector('.sidr-toggle');
  const sidrPanel = document.querySelector('#sidr');
  const closeMenuButton = document.querySelector('.close-menu-btn');

  sidrToggle.addEventListener('click', function (e) {
    sidrPanel.classList.toggle('toggled');
  });

  closeMenuButton.addEventListener('click', function (e) {
    sidrPanel.classList.toggle('toggled');
  });

  const collapseToggles = document.querySelectorAll('.collapse-toggle');

  collapseToggles.forEach(function (o) {
    const toggle = () => o.classList.toggle('toggled');
    o.addEventListener('click', toggle);
    const span = [...o.parentElement.children].find(c => c.matches('span.nav-link'));
    span?.addEventListener('click', toggle);
  });
})();
