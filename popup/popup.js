import {getActiveTabURL, isGitHubPrTab} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
        const activeTab = await getActiveTabURL();

        const container = document.getElementsByClassName("container")[0];
        if (isGitHubPrTab(activeTab)) {
            chrome.storage.sync.get(["branchNameRegex"]).then(({branchNameRegex = "main"}) => {
                container.innerHTML = `
                    <div class="title">
                        Squash & merge is going to be blocked on <code>${branchNameRegex}</code>
                        </br>
                        </br>
                        <div class="subtitle">
                        The current branch name regex is:
                        </div>
                    </div>`;
            });
        } else {
            container.innerHTML = '<div class="title">This is not a GitHub PR page</div>';
        }
    }
);
