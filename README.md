## 🔀 Custom URL Redirector

Define and manage your own URL redirections using powerful regex rules. Redirect links and navigations automatically, right from your browser.

### 💡 Examples
- ⭐ **My favorite: VS Code to Cursor Protocol Conversion**
  - Find: `^vscode:(.*)/(.*)`
  - Replace: `cursor:$1/$2`
- 🏷️ **Redirect new Reddit to old Reddit**
  - Find: `^https?://www\.reddit\.com/(.*)$`
  - Replace: `https://old.reddit.com/$1`
- 🌍 **Force country TLD**
  - Find: `^https://(.*)\.google\.com(.*)$`
  - Replace: `https://$1.google.co.uk$2`
- ✨ And any combinations you can imagine!

### ✨ Features
- 🧩 **Regex-based rules**: Find/replace using JavaScript RegExp and capture groups (e.g., $1).
- ⏯️ **Enable/disable per rule**: Quickly toggle rules without deleting them.
- 🧪 **Live test**: Try patterns against a URL before saving.
- 🌐 **Works everywhere**: Applies on link clicks and during navigation/new tabs.
- 🔒 **Private by design**: Rules are stored locally in your browser.

### 🛠️ Install (Chrome/Chromium)
1. Download or clone this repo.
2. Open `chrome://extensions`.
3. Enable "Developer mode" (top-right).
4. Click "Load unpacked" and select this folder.

### 🚀 Usage
1. Click the extension icon to open the popup.
2. Click "Add Rule" and fill in:
   - 🧠 **Find (Regex)**: JavaScript regex that matches the source URL.
   - 🔁 **Replace**: Replacement string (supports $1, $2... from capture groups).
   - ✅ **Enabled**: Toggle the rule on/off.
3. (Optional) Enter a URL and press "Test" to preview the result.
4. Save the rule. You can edit, toggle, or delete it anytime.

### 📝 Notes
- Rules are evaluated in saved order; the first enabled rule that changes the URL is used.
- Patterns follow JavaScript RegExp. Escape special characters as needed (e.g., `\.` for a dot).
- Redirects are applied on link clicks, tab URL changes, and before navigation completes.

### 🔑 Permissions
- **storage**: Save your rules locally.
- **tabs** and **webNavigation**: Observe and update tab URLs to perform redirects.

### 🛡️ Privacy
All data (your rules) are stored in `chrome.storage.local`. Nothing is sent anywhere.

### 🧹 Uninstall
Remove the extension from `chrome://extensions` to stop all behavior and delete stored rules.

---
Problems or ideas? 💬 Open an issue or tweak the code and reload unpacked.
