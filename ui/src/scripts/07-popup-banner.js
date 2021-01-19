;(function () {
  const cookieName = 'popup_banner_closed';

  function setClosed(value) {
    document.cookie = `${cookieName}=${value};path=/;max-age=31536000`;
  }

  function getClosed() {
    const cookie = document.cookie.split('; ').find(c => c.startsWith(`${cookieName}=`));
    return cookie && cookie.split('=')[1];
  }

  if (getClosed()) {
    return;
  }

  // skip showing the banner if the current page is already defender related
  if (window.location.pathname.startsWith('/defender')) {
    return;
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      const banner = document.createElement('div');
      banner.classList.add('popup-banner');
      banner.innerHTML = `
        <div class="popup-banner-text popup-banner-new">Automate your Ethereum operations with OpenZeppelin Defender — <a href="https://hubs.li/H0F1_Pt0">Learn More</a></div>
        <button class="popup-banner-close" aria-label="Close" title="Close"></button>
      `;

      banner.querySelector('.popup-banner-close').addEventListener('click', e => {
        setClosed(1);
        e.currentTarget.parentElement.remove();
      });

      document.body.appendChild(banner);
    }, 5000);
  });
})();
