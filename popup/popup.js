import { getActiveTabURL, isGitHubPrTab } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();

  const container = document.getElementsByClassName("container")[0];
  if (isGitHubPrTab(activeTab)) {
    chrome.storage.sync
      .get(["branchNameRegex"])
      .then(({ branchNameRegex = "main" }) => {
        container.innerHTML = `
    <div style="padding:18px 14px;">
      <div class="title" style="font-size:1.2em;font-weight:bold;margin-bottom:10px;">
        🚫 Squash &amp; Merge Blocked
      </div>
      <div class="description" style="margin-bottom:18px; color:#333;">
        If this PR is open, squash &amp; merge will be blocked.
      </div>
      <div class="subtitle" style="font-size:0.97em;color:#555;margin-bottom:8px;">
        <span>Current branch name regex:</span>
        <a href="chrome-extension://aabhjeaepficccegjneggegjjcegnhel/options/options.html" style="text-decoration:none;">
          <code style="background:#f5f5f5;padding:3px 8px;border-radius:5px;font-size:0.98em;">${branchNameRegex}</code>
        </a>
      </div>
    </div>
  `;
      });
  } else {
    container.innerHTML =
      '<div class="title">This is not a GitHub PR page</div>';
  }
});
