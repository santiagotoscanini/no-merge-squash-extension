import { getPageStatus } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementsByClassName("container")[0];
  const pageStatus = await getPageStatus();
  
  if (pageStatus.isValidUrl) {
    if (pageStatus.isPullRequest) {
      // Valid URL and is a PR - show the blocking status
      chrome.storage.sync
        .get(["branchNameRegex"])
        .then(({ branchNameRegex = "main" }) => {
          container.innerHTML = `
        <div style="padding:18px 14px;">
          <div class="title" style="font-size:1.2em;font-weight:bold;margin-bottom:10px;color:#28a745;">
            ✅ Extension Active
          </div>
          <div class="description" style="margin-bottom:18px; color:#333;">
            Squash &amp; merge will be blocked for branches matching the configured pattern.
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-size:0.9em;color:#666;margin-bottom:6px;">Current branch pattern:</div>
            <code style="background:#f5f5f5;padding:8px;border-radius:5px;font-size:0.9em;display:block;">${branchNameRegex}</code>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a 
              href="chrome-extension://nmdokabhfdgmgfbcfnimlifpggomdjhm/options/options.html"
              style="
                display:inline-block;
                padding:8px 16px;
                background:#0057d8;
                color:white;
                text-decoration:none;
                border-radius:5px;
                font-size:0.9em;
                font-weight:500;
                flex:1;
                text-align:center;
              "
            >
              ⚙️ Settings
            </a>
          </div>
        </div>
      `;
        });
    } else {
      // Valid URL but not a PR
      container.innerHTML = `
        <div style="padding:18px 14px;">
          <div class="title" style="font-size:1.2em;font-weight:bold;margin-bottom:10px;color:#17a2b8;">
            ℹ️ Repository Configured
          </div>
          <div class="description" style="margin-bottom:16px; color:#333;font-size:0.95em;line-height:1.4;">
            This repository is configured, but this is not a pull request page.
          </div>
          <a 
            href="chrome-extension://nmdokabhfdgmgfbcfnimlifpggomdjhm/options/options.html"
            style="
              display:inline-block;
              padding:8px 16px;
              background:#0057d8;
              color:white;
              text-decoration:none;
              border-radius:5px;
              font-size:0.9em;
              font-weight:500;
            "
          >
            ⚙️ Settings
          </a>
        </div>
      `;
    }
  } else {
    // Invalid URL - show configuration options
    const currentUrlPattern = pageStatus.url.replace(/\/pull\/.*$/, '/*');
    
    container.innerHTML = `
      <div style="padding:18px 14px;">
        <div class="title" style="font-size:1.2em;font-weight:bold;margin-bottom:10px;color:#e74c3c;">
          ⚠️ URL Not Configured
        </div>
        <div class="description" style="margin-bottom:16px; color:#333;font-size:0.95em;line-height:1.4;">
          This URL is not in your configured repository list.
        </div>
        <div style="margin-bottom:16px;">
          <div style="font-size:0.9em;color:#666;margin-bottom:6px;">Current URL:</div>
          <code style="background:#f8f9fa;padding:8px;border-radius:5px;font-size:0.85em;display:block;word-break:break-all;border:1px solid #e9ecef;">${pageStatus.url}</code>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <a 
            href="chrome-extension://nmdokabhfdgmgfbcfnimlifpggomdjhm/options/options.html"
            style="
              display:inline-block;
              padding:8px 16px;
              background:#0057d8;
              color:white;
              text-decoration:none;
              border-radius:5px;
              font-size:0.9em;
              font-weight:500;
              flex:1;
              text-align:center;
            "
          >
            Configure URLs
          </a>
          <a 
            href="chrome-extension://nmdokabhfdgmgfbcfnimlifpggomdjhm/options/options.html?addUrl=${encodeURIComponent(currentUrlPattern)}"
            style="
              display:inline-block;
              padding:8px 16px;
              background:#28a745;
              color:white;
              text-decoration:none;
              border-radius:5px;
              font-size:0.9em;
              font-weight:500;
              flex:1;
              text-align:center;
            "
          >
            + Add This Repo
          </a>
        </div>
      </div>
    `;
  }
});
