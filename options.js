document.getElementById('settings-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const postUrl = document.getElementById('post-url').value;
  const apiKey = document.getElementById('api-key').value;
  const selectors = document.getElementById('selectors').value;

  chrome.storage.local.set({ postUrl, apiKey, selectors }, () => {
    alert('Settings saved.');
  });

});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['postUrl', 'apiKey', 'selectors'], (result) => {
    
    if (result.postUrl) {
      document.getElementById('post-url').value = result.postUrl;
    }
    if (result.apiKey) {
      document.getElementById('api-key').value = result.apiKey;
    }
    if (result.selectors) {
      document.getElementById('selectors').value = result.selectors;
    }
  });
});
