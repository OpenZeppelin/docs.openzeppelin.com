(function () {
  'use strict';

  const sidrToggle = document.querySelector('.sidr-toggle');
  const sidrPanel = document.querySelector('#sidr');
  const mainContent = document.querySelector('.main');
  const closeMenuButton = document.querySelector('.close-menu-btn');

  sidrToggle.addEventListener('click', function (e) {
    sidrPanel.classList.toggle('toggled');
  });

  closeMenuButton.addEventListener('click', function (e) {
    sidrPanel.classList.toggle('toggled');
  });

  const isDefaultCollapsed = document.body.classList.contains('collapse-default');
  const collapseToggles = document.querySelectorAll('.collapse-toggle');

  collapseToggles.forEach(function (o) {
    if (isDefaultCollapsed && !o.parentElement.classList.contains('nav-li-active-parent')) {
      o.classList.toggle('toggled');
    }
    o.addEventListener('click', function (e) {
      this.classList.toggle('toggled');
    });
  });

  // The preinit class sets up collapsed states before JS executes to avoid flashing uncollapsed menu
  document.querySelector('.nav-collapse-preinit')?.classList.toggle('nav-collapse-preinit');
})();
