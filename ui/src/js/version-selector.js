window.addEventListener("load", function () {
  const versionBtn = document.getElementById("version-selector");
  if (!versionBtn) return;

  const popover = versionBtn.nextElementSibling;
  if (!popover || !popover.classList.contains("popover-container")) return;

  const setOpen = (open) => {
    versionBtn.classList.toggle("is-open", open);
    versionBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  versionBtn.setAttribute("aria-expanded", "false");
  versionBtn.setAttribute("aria-haspopup", "true");

  versionBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!versionBtn.classList.contains("is-open"));
  });

  document.addEventListener("click", function (e) {
    if (!versionBtn.contains(e.target) && !popover.contains(e.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
});
