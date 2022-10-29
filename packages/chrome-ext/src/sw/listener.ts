import type { Message } from '../types'

async function toggleBadge(tab: chrome.tabs.Tab) {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id })
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'
  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState
  })
  // if (nextState === 'ON') {
  //   // Insert the CSS file when the user turns the extension on
  //   await chrome.scripting.insertCSS({
  //     files: ['focus-mode.css'],
  //     target: { tabId: tab.id || 0 }
  //   })
  // } else if (nextState === 'OFF') {
  //   // Remove the CSS file when the user turns the extension off
  //   await chrome.scripting.removeCSS({
  //     files: ['focus-mode.css'],
  //     target: { tabId: tab.id || 0 }
  //   })
  // }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  })
})

chrome.runtime.onMessage.addListener((msg: Message, sender, sendResponse) => {
  console.log(`A content script sent a message: ${JSON.stringify(msg)}`)
  switch (msg.type) {
    case 'init':
      break
    case 'reload':
      // chrome.tabs.reload(msg.tabId, { bypassCache: true })
      break
    case 'badge':
      toggleBadge({ id: undefined } as any)
      break
    default:
      // chrome.tabs.sendMessage(msg.tabId, msg)
      break
  }
  return undefined
})

export {}
