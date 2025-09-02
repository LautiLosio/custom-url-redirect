// Content script: intercept link clicks and apply custom redirection rules
let csRules = [];

async function csLoadRules() {
  try {
    const { redirectRules } = await chrome.storage.local.get('redirectRules');
    csRules = (redirectRules || []).filter(r => r && r.enabled);
  } catch (e) {
    csRules = [];
  }
}

function csApply(url) {
  for (const r of csRules) {
    try {
      const re = new RegExp(r.findPattern);
      if (re.test(url)) {
        const nu = url.replace(re, r.replacePattern);
        if (nu !== url) return nu;
      }
    } catch (e) {}
  }
  return null;
}

function findAnchor(el) {
  while (el && el !== document && el.nodeType === 1) {
    if (el.tagName === 'A' && el.href) return el;
    el = el.parentElement;
  }
  return null;
}

function onDocClick(e) {
  const a = findAnchor(e.target);
  if (!a) return;
  const href = a.href;
  const newUrl = csApply(href);
  if (!newUrl) return;
  e.preventDefault();
  e.stopPropagation();
  try {
    if (a.target && a.target !== '_self') {
      window.open(newUrl, a.target);
    } else {
      window.location.assign(newUrl);
    }
  } catch (err) {
    window.location.href = newUrl;
  }
}

document.addEventListener('click', onDocClick, true);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.redirectRules) csLoadRules();
});

csLoadRules();
