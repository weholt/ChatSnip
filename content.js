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

function extractMessages(chatId, chatName) {
  const allMessages = document.querySelectorAll('div[data-testid], div[data-message-author-role]');
  const extractedContent = [{chatId: chatId, chatName}];
  let last_message = "";

  allMessages.forEach(element => {
    const images = element.querySelectorAll('img');
    if (images.length > 0) {
      images.forEach(img => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || 'Image';
        const type = 'image';
        extractedContent.push({
          role: 'assistant',
          content: alt,
          src,
          type,
        });
      });

      return;
    }

    const messageDiv = element.querySelector('div.relative, div.markdown');
    let role_element = element.querySelector('div[data-message-author-role]')
    let message_id = role_element?.getAttribute('data-message-id');
    let role = role_element?.getAttribute('data-message-author-role');
    if (role === undefined) {
      role = element.getAttribute('data-message-author-role') || undefined;
    }
    if (message_id === undefined) {
      message_id = element.getAttribute('data-message-id') || undefined;
    }

    if (messageDiv) {
      const codeBlocks = messageDiv.querySelectorAll('code');

      if (codeBlocks.length > 0) {
        codeBlocks.forEach(codeBlock => {
          const codeText = codeBlock.textContent.trim();
          const language = Array.from(codeBlock.classList)
            .filter(cls => !['!whitespace-pre', 'hljs'].includes(cls))
            .find(cls => cls.startsWith('language-'))?.replace('language-', '') || '';

          const filenameMatch = codeText.match(/# filename: (.+)/);
          const filename = filenameMatch ? filenameMatch[1] : '';
          const type = language;
          extractedContent.push({
            role,
            content: codeText,
            filename,
            type,
            language
          });
        });

        return;
      }

      const content = messageDiv.textContent.trim();
      if (codeBlocks.length === 0 && content !== 'ChatGPT' && role !== undefined && last_message !== `${role}:${content}`) {
        last_message = `${role}:${content}`;
        extractedContent.push({
          role,
          content
        });
      }
    }
  });

  return extractedContent;
}

function convertToMarkdown(data) {
  let markdownContent = '';
  data.forEach(item => {
    if (item.chatName) {
      markdownContent += `# ${item.chatName}\n\n`;
    }
    
    if (item.chatId) {
      markdownContent += `## chat-id: ${item.chatId}\n\n`;
      return;
    }
    
    if (item.type === 'image') {
      markdownContent += `![${item.content}](${item.src})\n\n`;
    } else if (item.type && item.type !== 'image') {
      markdownContent += `\`\`\`${item.type}\n`;
      if (item.filename) {
        markdownContent += `# filename: ${item.filename}\n\n`;
      }
      markdownContent += `${item.content}\n\`\`\`\n\n`;
    } else {
      markdownContent += `**${item.role}:** ${item.content}\n\n`;
    }
  });

  return markdownContent.replace("# endof", "").trim();
}

function extractMessagesAsMarkdown(chatId, chatName) {
  const jsonData = extractMessages(chatId, chatName);
  const markdownContent = convertToMarkdown(jsonData);
  return markdownContent;
}


function doda() {
  const chatId = window.location.href
  chrome.storage.local.get(['postUrl', 'apiKey', 'selectors', chatId, 'format'], (user_settings) => {
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

doda()
