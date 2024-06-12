

document.getElementById('copy-chat').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    });
  });
});

document.getElementById('post-chat').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['post_content.js']
    });
  });
});

document.getElementById('saveNameButton').addEventListener('click', () => {
  const chatName = prompt("Please enter a name for this chat", "").trim();
  console.log("Chat name:", chatName);
  if (chatName !== '') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      chrome.storage.local.set({ [currentUrl]: chatName }, () => {
        console.log('Chat name saved:', chatName, currentUrl);
        showToast("Chat name saved: " + chatName);
      });
    });
  }
});