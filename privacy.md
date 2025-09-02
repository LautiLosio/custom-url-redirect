# Custom URL Redirector — Privacy Policy

_Effective date: 2025-09-02_

## Overview

Custom URL Redirector runs entirely on your device. It applies user-defined regex rules to URLs you visit or click. The extension does not collect, transmit, or sell personal information.

## Data We Collect

- No personal information is collected by the developer.
- Data you provide: Redirect rules you create (`findPattern`, `replacePattern`, `enabled`). These are stored locally using `chrome.storage.local`.
- Ephemeral data processed: The current tab URL and clicked link URLs may be read in memory to evaluate your rules. This information is not stored, logged, or transmitted off your device.

## How We Use Data

- Apply your saved rules to update or redirect URLs during navigation and on link clicks.
- Provide an optional in-popup "Test" feature for trying a pattern against a URL; inputs are not saved unless you choose to save a rule.
- No profiling, advertising, or analytics.

## Data Sharing and Transfers

- We do not sell, rent, or share any data with third parties.
- The extension makes no external network requests and does not transmit data off your device.

## Permissions and Why They Are Needed

- `storage`: Save your redirect rules locally.
- `tabs`: Read and update the active tab's URL to perform redirects you configured.
- `webNavigation`: Observe top-level navigations so rules can be applied early.
- Host permissions (`<all_urls>`): Allow the content script to run on pages to intercept link clicks for on-device redirects. Page content is not collected or stored.

## Data Retention and Deletion

- Your rules remain in `chrome.storage.local` until you edit or delete them, clear browser data, or uninstall the extension.
- You can edit or delete rules from the extension's popup at any time.
- Uninstalling the extension removes all extension data from your browser.

## Children's Privacy

- This extension is not directed to children under 13 and does not knowingly collect personal information.

## Changes to This Policy

- We may update this policy from time to time. Changes will be posted in this file. Your continued use after changes become effective constitutes acceptance of the revised policy.

## Contact

- For questions or requests, please use the Support link on the Chrome Web Store listing or the project's issue tracker where you obtained this extension.

## Accessibility

- This policy is provided in this `privacy.md` file and should be linked in the Chrome Web Store Developer Dashboard's designated privacy policy field.
