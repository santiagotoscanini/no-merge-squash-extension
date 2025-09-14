// Saves options to chrome.storage
function save_options() {
  const branchNameRegex = document.getElementById("branchNameRegex").value;
  const urls = getUrlsFromUI();

  chrome.storage.sync.set({ branchNameRegex, urls }, function () {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(function () {
      status.textContent = "";
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync
    .get(["branchNameRegex", "urls"])
    .then(({ branchNameRegex = "main", urls = ["https://github.com/*"] }) => {
      document.getElementById("branchNameRegex").value = branchNameRegex;

      // Check if there's a URL parameter to add
      const urlParams = new URLSearchParams(window.location.search);
      const addUrl = urlParams.get("addUrl");

      if (addUrl && !urls.includes(addUrl)) {
        urls.push(addUrl);
        // Save the updated URLs
        chrome.storage.sync.set({ urls });
      }

      renderUrls(urls);

      // Highlight the newly added URL if it exists
      if (addUrl) {
        setTimeout(() => {
          const inputs = document.querySelectorAll(".url-input");
          inputs.forEach((input) => {
            if (input.value === addUrl) {
              input.style.background = "#fff3cd";
              input.style.border = "2px solid #ffc107";
              setTimeout(() => {
                input.style.background = "";
                input.style.border = "1px solid #ccc";
              }, 3000);
            }
          });
        }, 100);
      }
    });
}

// URL management functions
function getUrlsFromUI() {
  const urlInputs = document.querySelectorAll(".url-input");
  return Array.from(urlInputs)
    .map((input) => input.value.trim())
    .filter((url) => url.length > 0)
    .filter((url) => isValidUrlPattern(url));
}

function isValidUrlPattern(pattern) {
  try {
    // Test if it's a valid regex pattern
    new RegExp(pattern);
    return true;
  } catch (e) {
    // If it's not a valid regex, check if it's at least a valid URL-like string
    return pattern.includes("github.com") || pattern.startsWith("https://");
  }
}

function renderUrls(urls) {
  const container = document.getElementById("urlsContainer");
  container.innerHTML = "";

  urls.forEach((url, index) => {
    addUrlInput(url, index);
  });

  // Always have at least one empty input
  if (urls.length === 0) {
    addUrlInput("", 0);
  }
}

function addUrlInput(value = "", index = 0) {
  const container = document.getElementById("urlsContainer");
  const urlItem = document.createElement("div");
  urlItem.className = "url-item";
  urlItem.style.cssText = `
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    gap: 8px;
  `;

  urlItem.innerHTML = `
    <input
      type="text"
      class="url-input"
      value="${value}"
      placeholder="https://github.com/user/repo (supports regex)"
      title="Enter a URL or regex pattern. Examples: https://github.com/user/repo or https://github\.com/user/.*"
      style="
        flex: 1;
        padding: 8px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 0.95em;
        box-sizing: border-box;
      "
    />
    <button
      type="button"
      class="remove-url-btn"
      style="
        padding: 8px 12px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.2em;
        font-weight: normal;
        line-height: 1;
        min-width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
        font-family: monospace;
      "
      title="Remove URL"
    >
      &times;
    </button>
  `;

  container.appendChild(urlItem);

  // Add event listeners
  const input = urlItem.querySelector(".url-input");
  const removeBtn = urlItem.querySelector(".remove-url-btn");

  input.addEventListener("input", () => {
    // Add a new empty input if this is the last one and has content
    const allInputs = document.querySelectorAll(".url-input");
    const isLastInput =
      Array.from(allInputs).indexOf(input) === allInputs.length - 1;

    if (isLastInput && input.value.trim()) {
      addUrlInput();
    }
  });

  removeBtn.addEventListener("click", () => {
    const allInputs = document.querySelectorAll(".url-input");
    if (allInputs.length > 1) {
      urlItem.remove();
    } else {
      input.value = "";
    }
  });

  // Add hover effects
  removeBtn.addEventListener("mouseover", () => {
    removeBtn.style.background = "#c82333";
  });

  removeBtn.addEventListener("mouseout", () => {
    removeBtn.style.background = "#dc3545";
  });
}

function addNewUrl() {
  addUrlInput();
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
document.getElementById("addUrl").addEventListener("click", addNewUrl);
