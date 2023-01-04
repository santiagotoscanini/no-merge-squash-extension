chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // TODO: Check how can we avoid duplicating this
    if (tab.url && /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/pull\//.test(tab.url)) {
        chrome.tabs.sendMessage(tabId, {type: "PR_TAB_UPDATED"});
    }
});
