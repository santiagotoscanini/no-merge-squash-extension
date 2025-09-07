(() => {
  chrome.runtime.onMessage.addListener(chromeMessageListener);
})();

async function chromeMessageListener(request, sender, sendResponse) {
  // TODO: Check how can we avoid duplicating this
  if (/^https:\/\/github\.com\/[\w-]+\/[\w-]+\/pull\//.test(location.href)) {
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

function hideButtons() {
  // This one is the actual merge button
  const mergeButtonDefault = document.getElementsByClassName(
    "prc-Button-ButtonBase-c50BI flex-1"
  );
  const mergeButtonText = document.getElementsByClassName(
    "prc-Button-Label-pTQ3x"
  );

  modifyMergeButton(mergeButtonDefault[0], mergeButtonText[0]);

  // Listen for changes in button text
  if (mergeButtonText[0]) {
    const observer = new MutationObserver(() => {
      modifyMergeButton(mergeButtonDefault[0], mergeButtonText[0]);
    });

    observer.observe(mergeButtonText[0], {
      childList: true,
      subtree: true,
      characterData: true,
    });
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
