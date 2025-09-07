async function hideMergeButtons(details) {
  await chrome.tabs.sendMessage(details.tabId, {});
}

chrome.webRequest.onCompleted.addListener(hideMergeButtons, {
  urls: ["https://github.com/*/*/pull/*/page_data/status_checks"],
});
