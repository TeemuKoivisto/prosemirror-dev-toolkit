import type { Message } from '../types'

let messages = 0,
  foundInstances = 0,
  mountedInstances = new Map<string, number>()

async function toggleBadge(tabId: number) {
  const prevState = await chrome.action.getBadgeText({ tabId })
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'
  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tabId,
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
  // const port = chrome.runtime.connect({ name: 'pm-tab' })

  // port.onMessage.addListener(ev => {
  //   console.log('port received message: ', ev)
  // })
})

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

async function listener(msg: Message, sender: chrome.runtime.MessageSender) {
  const tab = sender.tab || (await getCurrentTab())
  console.log('tab', tab)
  switch (msg.type) {
    case 'injected':
      foundInstances = msg.data
      mountedInstances.set(tab.url || '', msg.data)
      // chrome.runtime.sendMessage({ type: 'sw-found', foundInstances })
      break
    case 'reload':
      // chrome.tabs.reload(msg.tabId, { bypassCache: true })
      break
    case 'badge':
      toggleBadge(sender.tab?.id as number)
      chrome.runtime.sendMessage({ type: 'sw-msgs', data: messages })
      break
    case 'pop-up-open':
      const instances = mountedInstances.get(tab.url || '') || 0
      chrome.runtime.sendMessage({ type: 'sw-found', data: instances })
      break
    default:
      // chrome.tabs.sendMessage(msg.tabId, msg)
      break
  }
}

chrome.runtime.onMessage.addListener((msg: Message, sender, sendResponse) => {
  console.log(`A content script sent a message: ${JSON.stringify(msg)}`)
  console.log('sender: ', sender)
  messages += 1
  listener(msg, sender)
  return undefined
})

export {}
