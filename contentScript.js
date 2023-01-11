(() => {
    // TODO: Check how can we avoid duplicating this
    if (/^https:\/\/github\.com\/[\w-]+\/[\w-]+\/pull\//.test(location.href)) {
        newPRLoaded();
    }
})();

async function newPRLoaded() {
    const prStatus = document.querySelectorAll("[reviewable_state]")[0].innerText

    if (prStatus.includes("Open")) {
        const basePRMessage = document.getElementsByClassName("flex-auto min-width-0 mb-2")[0].children
        // Position 2 is target branch and position 5 is source branch
        const targetBranch = basePRMessage[2].children[0].children[0].innerText

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
    const mergeButtonDefault = document.getElementsByClassName("btn-group-squash")
    hideAll(mergeButtonDefault)

    // This one is the one from the dropdown
    const mergeButtonDropdown = document.getElementsByClassName("js-merge-box-button-squash")
    hideAll(mergeButtonDropdown)
}

function hideAll(elements) {
    for (let element of elements) {
        element.style.display = "none"
    }
}
