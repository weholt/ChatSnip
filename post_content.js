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

function postChatContent() {
  chrome.storage.local.get(['postUrl', 'apiKey', 'selectors'], (result) => {
    const selectors = result.selectors ? result.selectors.split(',') : ['.markdown', '.message', '.chat-message', '.prose'];
    const postUrl = result.postUrl || 'https://example.com/post';
    const apiKey = result.apiKey || '';
    const { chatId, chatContent } = getChatContent(selectors);

    if (chatContent.trim() === "") {
      showToast("No chat content found to post.");
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
    };

    const isJson = (str) => {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    };

    if (isJson(chatContent)) {
      const jsonContent = JSON.parse(chatContent);
      const postPromises = Object.keys(jsonContent).map(key => {
        return fetch(postUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({ chatId, [key]: jsonContent[key] }),
        });
      });

      Promise.all(postPromises)
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {
          showToast("Chat content posted successfully!");
        })
        .catch((error) => {
          console.error('Error:', error);
          showToast("Failed to post chat content.");
        });

    } else {
      fetch(postUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ chatId, content: chatContent }),
      })
        .then(response => response.json())
        .then(data => {
          showToast("Chat content posted successfully!");
        })
        .catch((error) => {
          console.error('Error:', error);
          showToast("Failed to post chat content.");
        });
    }
  });
}

postChatContent();
