(function () {
  const codeElementSelector = '[data-lang]';
  const shellAliases = ['console', 'shell', 'sh', 'bash'];

  function onDOMContentLoaded(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function copyClick(e) {
    let code = e.target.parentElement.innerText;
    const codeParentElement = e.target.parentElement;
    const codeElement = codeParentElement.querySelector(codeElementSelector);
    const codeLanguage = codeElement?.dataset?.lang;
    const isShellLanguage = shellAliases.includes(codeLanguage);

    if (isShellLanguage) {
      code = code.replace(/\$ /gm, '');
    }

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
