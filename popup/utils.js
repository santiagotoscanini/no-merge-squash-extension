export async function getPageStatus() {
  const [tab] = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  
  const { urls = [] } = await chrome.storage.sync.get(["urls"]);
  const isValidUrl = urls.some((pattern) => {
    try {
      const regex = new RegExp(pattern);
      return regex.test(tab.url);
    } catch (e) {
      // Fallback to string matching if pattern is not valid regex
      return tab.url.startsWith(pattern);
    }
  });
  
  return {
    url: tab.url,
    isValidUrl,
    isPullRequest: /\/pull\/\d+/.test(tab.url)
  };
}

export async function isValidPR() {
  const status = await getPageStatus();
  return status.isValidUrl;
}
