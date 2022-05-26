document.addEventListener('click', function (e) {
  if (e.target.matches('.collapsible button')) {
    e.target.closest('.collapsible').classList.toggle('collapsed');
    e.preventDefault();
  }
});
