// Saves options to chrome.storage
function save_options() {
    const branchNameRegex = document.getElementById('branchNameRegex').value;
    chrome.storage.sync.set({branchNameRegex}, function () {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(["branchNameRegex"]).then(({branchNameRegex = "main"}) => {
        document.getElementById('branchNameRegex').value = branchNameRegex;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);