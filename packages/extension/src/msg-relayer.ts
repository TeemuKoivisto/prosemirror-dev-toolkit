import { PopUpMessages } from './types/messages'

// Resend messages from the page to the background script
function handleMessages<K extends keyof PopUpMessages>(
  event: MessageEvent<{ source: 'pm-dev-tools'; type: K; data: PopUpMessages[K] }>
) {
  if (!('source' in event.data) || event.data.source !== 'pm-dev-tools') return
  chrome.runtime.sendMessage(event.data)
}

window.addEventListener('message', handleMessages, false)

export {}
