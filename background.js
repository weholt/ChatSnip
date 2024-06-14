chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-chat-content") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      });
    });
  };

  if (command === "post-chat-content") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['post_content.js'],
      }, () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "postChatContent" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          } else {
            console.log("Response from content script:", response);
          }
        });
      });
    });
  }

//   if (command === "post-chat-content") {
//     console.log("post-chat-content command triggered.");

//     chrome.tabs.sendMessage(tabs[0].id, { action: "postChatContent" }, (response) => {
//       if (chrome.runtime.lastError) {
//         console.error("Error sending message:", chrome.runtime.lastError);
//       } else {
//         console.log("Response from content script:", response);
//       }
//     });

//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.scripting.executeScript({
//         target: { tabId: tabs[0].id },
//         files: ['post_content.js']
//       });
//     });
//   }



});


