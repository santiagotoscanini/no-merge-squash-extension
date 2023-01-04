(() => {
    // Listen for tab changes
    chrome.runtime.onMessage.addListener(chromeMessageListener);

    // First time run
    // TODO: Check how can we avoid duplicating this
    if (/^https:\/\/github\.com\/[\w-]+\/[\w-]+\/pull\//.test(location.href)) {
        newPRLoaded();
    }
})();

async function newPRLoaded() {
    const prStatus = document.querySelectorAll("[reviewable_state]")[0].innerText

    if (prStatus.includes("Open")) {
        const basePRMessage = document.getElementsByClassName("flex-auto min-width-0 mb-2")[0].children
        const targetBranch = basePRMessage[2].children[0].children[0].innerText
        // const sourceBranch = basePRMessage[5].children[0].children[0].innerText

        chrome.storage.sync.get(["branchNameRegex"]).then(({branchNameRegex = "main"}) => {
            if (targetBranch.match(branchNameRegex)) {
                // Execute after 1 second, because the PR buttons are loaded dynamically
                setTimeout(hideButtons, 1000);
            }
        });
    }
}

function hideButtons() {
    // This one is the actual merge button
    const mergeButtonDefault = document.getElementsByClassName("merge-box-button btn-group-squash rounded-left-2 btn btn-primary BtnGroup-item js-details-target hx_create-pr-button")[0]
    if (mergeButtonDefault) {
        mergeButtonDefault.style.display = "none";
    }

    // This one is the one from the dropdown
    const mergeButtonDropdown = document.getElementsByClassName("width-full select-menu-item js-merge-box-button-squash")[0]
    if (mergeButtonDropdown) {
        mergeButtonDropdown.style.display = "none";
    }
}

function chromeMessageListener(request, sender, sendResponse) {
    if (request.type === "PR_TAB_UPDATED") {
        newPRLoaded();
    }
}
