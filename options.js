function showToast(message) {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.right = '20px';
  toast.style.padding = '10px';
  toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  toast.style.color = 'white';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = '10000';
  document.body.appendChild(toast);
  setTimeout(() => {
      document.body.removeChild(toast);
  }, 3000);
}


document.getElementById('settings-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const postUrl = document.getElementById('post-url').value;
  const apiKey = document.getElementById('api-key').value;
  const chat_bot = document.getElementById('chat_bot').value;
  const format = document.getElementById('format').value;

  chrome.storage.local.set({ postUrl, apiKey, chat_bot, format}, () => {
    showToast('Settings saved.');
  });

});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['postUrl', 'apiKey', 'chat_bot', 'format'], (result) => {

    if (result.postUrl) {
      document.getElementById('post-url').value = result.postUrl;
    }
    if (result.apiKey) {
      document.getElementById('api-key').value = result.apiKey;
    }
    if (result.chat_bot) {
      document.getElementById('chat_bot').value = result.chat_bot;
    }
    if (result.format) {
      document.getElementById('format').value = result.format;
    }
  });
});

