import { PopUpMessages } from './types/messages'

// Resend messages from the page to the background script
function handleMessages<K extends keyof PopUpMessages>(
  event: MessageEvent<{ type: K; data: PopUpMessages[K] }>
) {
  chrome.runtime.sendMessage(event.data)
}

window.addEventListener('message', handleMessages, false)

export {}
