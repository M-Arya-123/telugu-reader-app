// Grab the DOM elements from popup.html
const toggle = document.getElementById("enabledToggle") as HTMLInputElement | null;
const statusText = document.getElementById("statusText") as HTMLDivElement | null;

function updateUI(isEnabled: boolean) {
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

// 1. When the popup opens, load the saved preference (defaults to true)
chrome.storage.sync.get({ enabled: true }, (data) => {
    updateUI(Boolean(data.enabled));
});

// 2. When the toggle is clicked, save the new state to chrome.storage
if (toggle) {
    toggle.addEventListener("change", () => {
        const isEnabled = toggle.checked;
        updateUI(isEnabled);
        chrome.storage.sync.set({ enabled: isEnabled });
    });
}
