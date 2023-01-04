### No merge-squash extension

Chrome extension to hide the "Squash & Merge" buttons on GitHub pull requests.

#### How it works?

It hides:

* The green one that by default is the last one you used (so it force you to pick another one).
* The option from the dropdown menu.

##### Before

![before-cropped.png](static%2Fbefore-cropped.png)

##### After

![after-cropped.png](static%2Fafter-cropped.png)

#### Configuring the extension

On the options page you can configure the branch to hide the button for. By default, it's `main`.

It supports regex, so you can hide the button for multiple branches.

#### Installing the extension

Extension is being reviewed by Google, so it's not available on the Chrome Web Store yet.
To install it, you need to:
* Download the extension code from GitHub.
* Go to `chrome://extensions/` and enable the developer mode.
* Click on "Load unpacked" and select the folder where you downloaded the extension code.
* You should see the extension installed.
* Go to the options page and configure the branch you want to hide the button for.
* You're done!

#### Why?

This seems like a problem that many people share:

* [Related GitHub discussion](https://github.com/community/community/discussions/10809)
* [StackOverflow question](https://stackoverflow.com/questions/65898390/is-there-a-way-to-disable-squash-and-merge-for-certain-branches-in-github)

---

The icons for this extension have been designed using images from Flaticon.com

Attribution to Royyan Wijaya