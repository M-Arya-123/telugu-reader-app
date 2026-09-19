"use strict";
(() => {
  // extension/src/popup.ts
  var toggle = document.getElementById("enabledToggle");
  var statusText = document.getElementById("statusText");
  function updateUI(isEnabled) {
    if (toggle) {
      toggle.checked = isEnabled;
    }
    if (statusText) {
      statusText.textContent = isEnabled ? "Active" : "Paused";
      if (isEnabled) {
        statusText.classList.remove("disabled");
      } else {
        statusText.classList.add("disabled");
      }
    }
  }
  chrome.storage.sync.get({ enabled: true }, (data) => {
    updateUI(Boolean(data.enabled));
  });
  if (toggle) {
    toggle.addEventListener("change", () => {
      const isEnabled = toggle.checked;
      updateUI(isEnabled);
      chrome.storage.sync.set({ enabled: isEnabled });
    });
  }
})();
