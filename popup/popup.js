import { getActiveTabURL, isGitHubPrTab } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();

  const container = document.getElementsByClassName("container")[0];
  if (isGitHubPrTab(activeTab)) {
    chrome.storage.sync
      .get(["branchNameRegex"])
      .then(({ branchNameRegex = "main" }) => {
        container.innerHTML = `
                    <div class="title">
                        Squash & merge is going to be blocked if the PR is open.
                        </br>
                        </br>
                        <div class="subtitle">
                        The current branch name regex is: <a href="chrome-extension://aabhjeaepficccegjneggegjjcegnhel/options/options.html"><code>${branchNameRegex}</code></a>
                        </div>
                    </div>`;
      });
  } else {
    container.innerHTML =
      '<div class="title">This is not a GitHub PR page</div>';
  }
});
