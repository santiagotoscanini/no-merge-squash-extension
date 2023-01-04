import {getActiveTabURL, isGitHubPrTab} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
        const activeTab = await getActiveTabURL();

        const container = document.getElementsByClassName("container")[0];
        if (isGitHubPrTab(activeTab)) {
            container.innerHTML = '<div class="title">Squash & merge is going to be blocked if the PR is open and the target is main</div>';
        } else {
            container.innerHTML = '<div class="title">This is not a GitHub PR page</div>';
        }
    }
);
