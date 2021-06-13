(() => {
  'use strict';

  const toggles = document.querySelectorAll('.js-version');
  for (let i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener('click', (e) => e.stopPropagation());
    toggles[i].addEventListener('change', (e) => window.location.href = e.target.value);
  };
})();
