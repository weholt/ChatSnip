

document.getElementById('copy-chat').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['common.js', 'content.js']
    }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => { copy_to_clipboard(); },
      }, (results) => {
        console.log("Results copy:", results);
      });
    });
  });
});

document.getElementById('post-chat').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['common.js', 'content.js']
    }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => { postChatContent(); },
      }, (results) => {
        console.log("Results post:", results);
      });
    });
  });
});

document.getElementById('saveNameButton').addEventListener('click', () => {
  const chatName = prompt("Please enter a name for this chat", document.title);
  console.log("Chat name:", chatName);
  if (chatName !== null && chatName.trim() !== '') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      chrome.storage.local.set({ [currentUrl]: chatName.trim() }, () => {
        console.log('Chat name saved:', chatName, currentUrl);
        showToast("Chat name saved: " + chatName);
      });
    });
  }
});