![ChatSnip Logo](icon.png)

# ChatSnip - (ChatGPT) Chat Exporter Chrome Extension

## Overview

ChatSnip allows users to copy ChatGPT chat content (and maybe content from other AI chat clients as well) to their clipboard or post it to a specified URL. 
This extension supports customizable CSS selectors for chat elements, and it can include an optional API key for authentication when posting data.

## Features

- Copy chat content to the clipboard with a keyboard shortcut.
- Post chat content to a specified URL with a keyboard shortcut.
- Configurable CSS selectors for chat elements.
- Optional API key for authentication.
- Toast notifications for feedback.
- Supports JSON format detection and separate posting of JSON keys.
- Uses the current URL as a unique identifier for each chat.

## Installation

1. Download or clone the repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable Developer mode by toggling the switch in the top right corner.
4. Click "Load unpacked" and select the extension directory.

## Usage

### Keyboard Shortcuts

- **Copy Chat Content**: `Ctrl+Shift+Y` (Windows/Linux) or `Command+Shift+Y` (Mac)
- **Post Chat Content**: `Ctrl+Shift+U` (Windows/Linux) or `Command+Shift+U` (Mac)

### Settings

1. Click on the extension icon in the toolbar.
2. Click the "Settings" button to open the options page.
3. Configure the following settings:
   - **Post URL**: The URL to which the chat content will be posted.
   - **API Key**: (Optional) The API key for authentication.
   - **Selectors**: Comma-separated CSS selectors for chat elements.

### Copying Chat Content

1. Navigate to the ChatGPT chat page.
2. Click the extension icon and click "Copy Chat Content" or use the keyboard shortcut.

### Posting Chat Content

1. Navigate to the ChatGPT chat page.
2. Click the extension icon and click "Post Chat Content" or use the keyboard shortcut.

## Customization

### CSS Selectors

The extension allows you to specify custom CSS selectors for chat elements. By default, it uses:

- `.markdown`
- `.message`
- `.chat-message`
- `.prose` (For [OpenUI](https://docs.openwebui.com/))

These selectors can be configured in the settings page.

### Using Current URL for Chat ID

The extension uses the current URL as a unique identifier for each chat. This identifier is included in the post request to differentiate between chats.

## Development

To contribute or modify the extension:

1. Clone the repository.
2. Make your changes.
3. Reload the extension in Chrome by navigating to `chrome://extensions`, disabling and re-enabling Developer mode, and clicking "Load unpacked" again.

## License

This project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3.
