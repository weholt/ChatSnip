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

function getImages() {
  const images = document.querySelectorAll('img');
  return Array.from(images).map(img => ({
      src: img.src,
      alt: img.alt
  }));    
}



function postChatContent() {
  console.log("postChatContent function triggered.");

  chrome.storage.local.get(['postUrl', 'apiKey', 'selectors', window.location.href], (result) => {
    console.log("Storage retrieval attempted.");
    console.log("Retrieved storage values:", result);

    if (chrome.runtime.lastError) {
      console.error("Error retrieving storage values:", chrome.runtime.lastError);
      showToast("Error retrieving storage values: " + chrome.runtime.lastError.message);
      return;
    }

    const selectors = result.selectors ? result.selectors.split(',') : ['.markdown', '.message', '.chat-message', '.prose'];
    const postUrl = result.postUrl || 'http://localhost:8000/api/chats/';
    const apiKey = result.apiKey || '';

    console.log("Post URL:", postUrl);
    console.log("API Key:", apiKey);
    console.log("Selectors:", selectors);

    const { chatId, chatContent } = getChatContent(selectors);
    const chatName = result[window.location.href] || window.location.href;

    if (chatContent.trim() === "") {
      showToast("No chat content found to post.");
      console.log("No chat content found.");
      return;
    }

    console.log("Chat ID:", chatId);

    const headers = {
      'Content-Type': 'application/json'
    };

    console.log("Headers:", headers);

    const isJson = (str) => {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    };

    console.log(getImages())

    const bodyContent = {
      chatId,
      content: chatContent,
      apiKey: apiKey,
      chatName: chatName,
      images: getImages()
    };

    if (isJson(chatContent)) {
      console.log("Chat content is JSON.");
      const jsonContent = JSON.parse(chatContent);
      Object.assign(bodyContent, jsonContent);

      const postPromises = Object.keys(jsonContent).map(key => {
        return fetch(postUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(Object.assign({}, bodyContent, { [key]: jsonContent[key] })),
        });
      });

      Promise.all(postPromises)
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {
          showToast(data.status);
        })
        .catch((error) => {
          console.error('Error:', error);
          showToast("Failed to post chat content: " + error);
        });

    } else {
      console.log("Chat content is not JSON.");
      fetch(postUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyContent),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Post response:", data);
          showToast(data.status);
        })
        .catch((error) => {
          console.error('Error:', error);
          showToast("Failed to post chat content: " + error);
        });
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "postChatContent") {
    postChatContent();
    sendResponse({ status: "Content script received the message" });
  }
});

postChatContent();