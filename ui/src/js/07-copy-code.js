(function () {
  function onDOMContentLoaded(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function copyClick(e) {
    const code = e.target.parentElement.innerText;
    navigator.clipboard.writeText(code);
  }

  onDOMContentLoaded(() => {
    for (const elem of document.querySelectorAll('.listingblock')) {
      const btn = document.createElement('button');
      btn.classList.add('btn-icon', 'btn-copy', 'hljs');
      btn.setAttribute('aria-label', 'Copy');
      btn.innerHTML = '<svg class="icon"><use href="#copy-icon"/></svg>';
      btn.addEventListener('click', copyClick);
      elem.prepend(btn);
    }
  });
})();
