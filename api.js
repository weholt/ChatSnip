

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "postChatContent")
        showToast("API - ITS WORKING");    
    }
  );
