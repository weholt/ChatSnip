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


function getChatContent(selectors) {
  let chatContent = "";
  const chatId = window.location.href;

  for (const selector of selectors) {
    let chatElements = document.querySelectorAll(selector);
    if (chatElements.length > 0) {
      chatElements.forEach(element => {
        chatContent += element.innerText + "\n\n";
      });
      if (chatContent.trim() !== "") {
        break;
      }
    }
  }

  return { chatId, chatContent };
}

function copyChatContent() {
  chrome.storage.local.get(['selectors'], (result) => {
    const selectors = result.selectors ? result.selectors.split(',') : ['.markdown', '.message', '.chat-message', '.prose'];
    const { chatId, chatContent } = getChatContent(selectors);

    if (chatContent.trim() === "") {
      showToast("No chat content found to copy.");
      return;
    }

    const el = document.createElement('textarea');
    el.value = chatContent;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast("Chat content copied to clipboard!");
  });
}

copyChatContent();
