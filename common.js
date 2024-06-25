function extractMessages(chatId, chatName) {
  const allMessages = document.querySelectorAll('div[data-testid], div[data-message-author-role]');
  const extractedContent = [{ chatId: chatId, chatName }];
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
      markdownContent += `[Chat](${item.chatId})\n\n`;
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


function postJsonToServer(postUrl, bodyContent) {
  return fetch(postUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.assign({}, bodyContent))
  });
}


function postChatContent() {  

  chrome.storage.local.get(['postUrl', 'apiKey', 'chatbot', window.location.href], (result) => {
    const postUrl = result.postUrl || 'http://localhost:8000/api/chats/';
    const apiKey = result.apiKey || '';
    const chatId = window.location.href;
    const chatName = result[chatId] || chatId;
    const chatBot = result.chatbot;
    const llm_model = undefined;
    const content = extractMessages(chatId, chatName);
    const bodyContent = {
      chatId,
      content,
      apiKey,
      chatName,
      chatBot,
      llm_model,
      markdown: convertToMarkdown(content)
    };

  postJsonToServer(postUrl, bodyContent)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      showToast(data.status);
    }).catch(error => console.error('Error:', error));
    
  });
}