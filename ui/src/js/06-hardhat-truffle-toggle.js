(function () {
  window.addEventListener('click', e => {
    if (!event.target.classList.contains('hardhat-truffle-toggle')) {
      return;
    }

    togglePreference();
    e.preventDefault();
  });

  const cookieName = 'hardhat_truffle_preference';
  const paramName = 'pref';
  const defaultPreference = 'hardhat';

  function getCookie() {
    const cookie = document.cookie.split('; ').find(c => c.startsWith(`${cookieName}=`));
    return cookie && cookie.split('=')[1];
  }

  function setCookie(preference) {
    document.cookie = `${cookieName}=${preference};path=/;max-age=31536000`;
  }

  function getURLParam() {
    return new URLSearchParams(document.location.search).get(paramName);
  }

  function setURLParam(preference) {
    const url = new URL(document.location);
    const params = new URLSearchParams(url.search);
    params.set('pref', preference);
    url.search = params.toString();
    history.replaceState(null, '', [url]);
  }

  function getPreference() {
    const current = getURLParam() || getCookie();
    if (current === 'hardhat' || current === 'truffle') {
      return current;
    } else {
      return defaultPreference;
    }
  }

  function togglePreference() {
    const current = getPreference();
    const other = current === 'hardhat' ? 'truffle' : 'hardhat';
    document.body.classList.replace(`preference-${current}`, `preference-${other}`);
    setCookie(other);
    setURLParam(other);
  }

  const current = getPreference();
  setCookie(current);
  document.body.classList.add(`preference-${current}`);
})();
