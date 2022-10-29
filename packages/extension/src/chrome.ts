import type { Message } from './types'

// export function getTab() {
//   return chrome.tabs.
// }

export function sendMessage(msg: Message) {
  return chrome.runtime.sendMessage(msg)
}

// chrome.runtime.onMessage.addListener((msg: Message, sender, sendResponse) => {
//   console.log('chrome msg', msg)
// })
