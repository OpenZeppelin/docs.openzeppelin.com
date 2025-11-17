window.addEventListener("load", function () {
  const versionBtn = document.getElementById("version-selector");
  versionBtn?.addEventListener("click", function () {
    versionBtn.focus();
  });
  const llmBtn = document.getElementById("llm-selector");
  llmBtn?.addEventListener("click", function () {
    llmBtn.focus();
  });
});
