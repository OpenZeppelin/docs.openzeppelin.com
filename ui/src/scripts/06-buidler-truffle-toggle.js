(function () {
  window.addEventListener('click', e => {
    if (!event.target.classList.contains('buidler-truffle-toggle')) {
      return;
    }

    togglePreference();
    e.preventDefault();
  });

  const cookieName = 'buidler_truffle_preference';
  const defaultPreference = 'buidler';

  function getPreference() {
    const cookie = document.cookie.split('; ').find(c => c.startsWith(`${cookieName}=`));
    const current = cookie && cookie.split('=')[1] || defaultPreference;
    const other = current === 'buidler' ? 'truffle' : 'buidler';
    return { current, other };
  }

  function togglePreference() {
    const { current, other } = getPreference();
    document.body.classList.replace(`preference-${current}`, `preference-${other}`);
    document.cookie = `${cookieName}=${other};path=/;max-age=31536000`;
  }

  const { current } = getPreference();
  document.body.classList.add(`preference-${current}`);
})();
