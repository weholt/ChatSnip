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


function copy_to_clipboard() {
    const chatId = window.location.href
    chrome.storage.local.get(['postUrl', 'apiKey', 'chatbot', chatId, 'format'], (user_settings) => {
        const chatName = user_settings[chatId] || chatId;
        const format = user_settings['format'] || 'json';
        console.log("Storage retrieval attempted.", chatName);
        console.log("Retrieved storage values:", user_settings);

        const result = format === 'json' ? JSON.stringify(extractMessages(chatId, chatName), null, 2) : extractMessagesAsMarkdown(chatId, chatName);
        if (result.trim() === "") {
            showToast("No chat content found to copy.");
            return;
        }

        const el = document.createElement('textarea');
        el.value = result;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast("Chat content copied to clipboard!");
    });
}

//copy_to_clipboard()
