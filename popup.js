// Popup script for managing redirect rules
const rulesList = document.getElementById('rulesList');
const emptyState = document.getElementById('emptyState');
const addRuleBtn = document.getElementById('addRuleBtn');
const editor = document.getElementById('editor');
const editorTitle = document.getElementById('editorTitle');
const findPatternInput = document.getElementById('findPattern');
const replacePatternInput = document.getElementById('replacePattern');
const ruleEnabledInput = document.getElementById('ruleEnabled');
const testUrlInput = document.getElementById('testUrl');
const testBtn = document.getElementById('testBtn');
const testResult = document.getElementById('testResult');
const saveRuleBtn = document.getElementById('saveRuleBtn');
const cancelBtn = document.getElementById('cancelBtn');

let editingIndex = null;

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function loadRules() {
  const result = await chrome.storage.local.get('redirectRules');
  const rules = result.redirectRules || [];
  renderRules(rules);
}

function renderRules(rules) {
  rulesList.innerHTML = '';
  if (!rules.length) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  rules.forEach((rule, index) => {
    const li = document.createElement('li');
    const meta = document.createElement('div');
    meta.className = 'rule-meta';
    const title = document.createElement('div');
    title.className = 'rule-pattern';
    title.textContent = rule.findPattern;
    const replace = document.createElement('div');
    replace.className = 'rule-replace';
    replace.textContent = `→ ${rule.replacePattern}`;
    meta.appendChild(title);
    meta.appendChild(replace);

    const actions = document.createElement('div');
    actions.className = 'actions-inline';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = `${rule.enabled ? 'primary active-pulse' : 'secondary'} icon`;
    toggleBtn.textContent = rule.enabled ? '⏸' : '▶';
    toggleBtn.title = rule.enabled ? 'Disable' : 'Enable';
    toggleBtn.setAttribute('aria-pressed', String(!!rule.enabled));
    toggleBtn.addEventListener('click', async () => {
      const data = await chrome.storage.local.get('redirectRules');
      const rulesNow = data.redirectRules || [];
      rulesNow[index].enabled = !rulesNow[index].enabled;
      await chrome.storage.local.set({ redirectRules: rulesNow });
      loadRules();
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'secondary icon';
    editBtn.textContent = '✎';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', async () => {
      editingIndex = index;
      editorTitle.textContent = 'Edit Rule';
      findPatternInput.value = rule.findPattern;
      replacePatternInput.value = rule.replacePattern;
      ruleEnabledInput.checked = !!rule.enabled;
      editor.classList.remove('hidden');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'secondary icon danger';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', async () => {
      const data = await chrome.storage.local.get('redirectRules');
      const rulesNow = data.redirectRules || [];
      rulesNow.splice(index, 1);
      await chrome.storage.local.set({ redirectRules: rulesNow });
      loadRules();
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(meta);
    li.appendChild(actions);
    rulesList.appendChild(li);
  });
}

function resetEditor() {
  editingIndex = null;
  editorTitle.textContent = 'Add Rule';
  findPatternInput.value = '';
  replacePatternInput.value = '';
  ruleEnabledInput.checked = true;
  testUrlInput.value = '';
  testResult.textContent = '';
  editor.classList.add('hidden');
}

addRuleBtn.addEventListener('click', () => {
  resetEditor();
  editor.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
  resetEditor();
});

saveRuleBtn.addEventListener('click', async () => {
  const findPattern = findPatternInput.value.trim();
  const replacePattern = replacePatternInput.value.trim();
  const enabled = ruleEnabledInput.checked;

  if (!findPattern) {
    alert('Find pattern is required');
    return;
  }

  try {
    new RegExp(findPattern);
  } catch (e) {
    alert('Invalid regex pattern');
    return;
  }

  const data = await chrome.storage.local.get('redirectRules');
  const rules = data.redirectRules || [];
  const newRule = { id: uuid(), findPattern, replacePattern, enabled };

  if (editingIndex === null) {
    rules.push(newRule);
  } else {
    rules[editingIndex] = { ...rules[editingIndex], ...newRule };
  }

  await chrome.storage.local.set({ redirectRules: rules });
  resetEditor();
  loadRules();
});

// Test pattern against input URL

testBtn.addEventListener('click', async () => {
  const pattern = findPatternInput.value.trim();
  const replacement = replacePatternInput.value.trim();
  const testUrl = testUrlInput.value.trim();
  if (!pattern || !testUrl) {
    testResult.textContent = 'Enter a pattern and a test URL to try it.';
    return;
  }
  const resp = await chrome.runtime.sendMessage({ action: 'testPattern', pattern, replacement, testUrl });
  if (!resp.valid) {
    testResult.textContent = `Invalid pattern: ${resp.error}`;
  } else if (!resp.matches) {
    testResult.textContent = 'No match.';
  } else {
    testResult.textContent = `Result: ${resp.result}`;
  }
});

// Initial load
loadRules();
