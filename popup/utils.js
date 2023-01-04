export function isGitHubPrTab(tab) {
    return tab.url && /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/pull\//.test(tab.url)
}

export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });

    return tabs[0];
}
