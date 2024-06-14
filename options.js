

document.getElementById('settings-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const postUrl = document.getElementById('post-url').value;
  const apiKey = document.getElementById('api-key').value;
  const selectors = document.getElementById('selectors').value;
  const format = document.getElementById('format').value;

  chrome.storage.local.set({ postUrl, apiKey, selectors, format}, () => {
    showToast('Settings saved.');
  });

});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['postUrl', 'apiKey', 'selectors', 'format'], (result) => {

    if (result.postUrl) {
      document.getElementById('post-url').value = result.postUrl;
    }
    if (result.apiKey) {
      document.getElementById('api-key').value = result.apiKey;
    }
    if (result.selectors) {
      document.getElementById('selectors').value = result.selectors;
    }
    if (result.format) {
      document.getElementById('format').value = result.format;
    }
  });
});

