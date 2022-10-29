import App from './App.svelte'
import { InjectMessages } from '../types/messages'

// Resend messages from the inject.ts to the background script
function handleMessages<K extends keyof InjectMessages>(
  event: MessageEvent<{ source: 'pm-dev-tools'; type: K; data: InjectMessages[K] }>
) {
  if (!('source' in event.data) || event.data.source !== 'pm-dev-tools') return
  chrome.runtime.sendMessage({ ...event.data })
}

window.addEventListener('message', handleMessages, false)

new App({ target: document.body })

export {}
