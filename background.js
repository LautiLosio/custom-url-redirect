// Background service worker for URL redirection
let redirectRules = [];

// Load redirect rules from storage
async function loadRedirectRules() {
  try {
    const result = await chrome.storage.local.get('redirectRules');
    redirectRules = result.redirectRules || [];
  } catch (error) {
    console.error('Error loading redirect rules:', error);
    redirectRules = [];
  }
}

// Apply redirection rules to a URL
function applyRedirectionRules(url) {
  for (const rule of redirectRules) {
    if (!rule.enabled) continue;
    
    try {
      const regex = new RegExp(rule.findPattern);
      if (regex.test(url)) {
        const newUrl = url.replace(regex, rule.replacePattern);
        if (newUrl !== url) {
          return newUrl;
        }
      }
    } catch (error) {
      console.error('Error applying rule:', rule, error);
    }
  }
  return null;
}

// Handle tab updates (when URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const redirectedUrl = applyRedirectionRules(changeInfo.url);
    if (redirectedUrl) {
      try {
        await chrome.tabs.update(tabId, { url: redirectedUrl });
      } catch (error) {
        console.error('Error redirecting URL:', error);
      }
    }
  }
});

// Handle new tab creation
chrome.tabs.onCreated.addListener(async (tab) => {
  if (tab.url && tab.url !== 'chrome://newtab/') {
    const redirectedUrl = applyRedirectionRules(tab.url);
    if (redirectedUrl) {
      try {
        await chrome.tabs.update(tab.id, { url: redirectedUrl });
      } catch (error) {
        console.error('Error redirecting URL on tab creation:', error);
      }
    }
  }
});

// Listen for web navigation events (before navigation completes)
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId === 0) { // Main frame only
    const redirectedUrl = applyRedirectionRules(details.url);
    if (redirectedUrl) {
      try {
        await chrome.tabs.update(details.tabId, { url: redirectedUrl });
      } catch (error) {
        console.error('Error redirecting URL on navigation:', error);
      }
    }
  }
});

// Listen for storage changes to update rules
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.redirectRules) {
    redirectRules = changes.redirectRules.newValue || [];
  }
});

// Message handler for popup communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRules') {
    sendResponse({ rules: redirectRules });
  } else if (request.action === 'testPattern') {
    try {
      const regex = new RegExp(request.pattern);
      const result = regex.test(request.testUrl);
      const replacement = request.testUrl.replace(regex, request.replacement);
      sendResponse({ 
        valid: true, 
        matches: result,
        result: replacement 
      });
    } catch (error) {
      sendResponse({ 
        valid: false, 
        error: error.message 
      });
    }
  }
  return true;
});

// Initialize
loadRedirectRules();