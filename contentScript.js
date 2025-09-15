(() => {
  chrome.runtime.onMessage.addListener(chromeMessageListener);
})();

async function chromeMessageListener(request, sender, sendResponse) {
  const { urls = [] } = await chrome.storage.sync.get(["urls"]);
  const isValidPR = urls.some((pattern) => {
    try {
      const regex = new RegExp(pattern);
      return regex.test(location.href);
    } catch (e) {
      // Fallback to string matching if pattern is not valid regex
      return location.href.startsWith(pattern);
    }
  });

  if (isValidPR) {
    await onButtonsLoaded();
  }
}

async function onButtonsLoaded() {
  const prStatus = document.querySelectorAll("[reviewable_state]")[0].innerText;

  if (prStatus.includes("Open")) {
    const basePRMessage = document.getElementsByClassName(
      "flex-auto min-width-0 mb-2"
    )[0].children;
    // Position 2 is target branch and position 5 is source branch
    const targetBranch = basePRMessage[2].children[0].children[0].innerText;

    chrome.storage.sync
      .get(["branchNameRegex"])
      .then(({ branchNameRegex = "main" }) => {
        if (targetBranch.match(branchNameRegex)) {
          hideButtons();
        }
      });
  }
}

function findSquashButton() {
  // Find all buttons and search for one containing "Squash and merge" text
  const buttons = document.querySelectorAll("button");
  return Array.from(buttons).find((button) => {
    return (
      button.textContent && button.textContent.toLowerCase().includes("merge")
    );
  });
}

function hideButtons() {
  // Find button by text content instead of class name
  const mergeButtonDefault = findSquashButton();

  if (mergeButtonDefault) {
    // Find the innermost span that contains the text (span span structure)
    const textSpan = mergeButtonDefault.querySelector("span span");

    if (textSpan) {
      modifyMergeButton(mergeButtonDefault, textSpan);

      // Listen for changes in button text
      const observer = new MutationObserver(() => {
        if (textSpan) {
          modifyMergeButton(mergeButtonDefault, textSpan);
        }
      });

      observer.observe(textSpan, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }
}

function modifyMergeButton(mergeButtonDefault, mergeButtonText) {
  if (mergeButtonText.textContent.includes("Squash")) {
    if (!mergeButtonText.textContent.includes("(disabled by extension)")) {
      mergeButtonText.textContent += " (disabled by extension)";
    }
    mergeButtonDefault.disabled = true;
  } else {
    mergeButtonDefault.disabled = false;
  }
}
