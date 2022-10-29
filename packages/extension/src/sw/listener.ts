// import type { Message } from '../types'
import type { Message, InjectMessages, PopUpMessages, SWMessages } from '../types/messages'

const mountedInstances = new Map<string, number>()

async function toggleBadge(tabId: number) {
  const prevState = await chrome.action.getBadgeText({ tabId })
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'
  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tabId,
    text: nextState
  })
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

async function listener<K extends keyof InjectMessages & keyof PopUpMessages>(
  msg: { source: string; type: K; data: InjectMessages[K] | PopUpMessages[K] },
  sender: chrome.runtime.MessageSender
) {
  if (!('source' in msg) || msg.source !== 'pm-dev-tools') return
  const tab = sender.tab || (await getCurrentTab())
  console.log('tab', tab)
  const type = msg.type as keyof InjectMessages | keyof PopUpMessages
  switch (type) {
    case 'found_instances':
      mountedInstances.set(tab.url || '', msg.data)
      break
    case 'reload':
      // chrome.tabs.reload(msg.tabId, { bypassCache: true })
      break
    case 'badge':
      toggleBadge(sender.tab?.id as number)
      break
    case 'open':
      send('current_instances', mountedInstances.get(tab.url || '') || 0)
      break
    default:
      // chrome.tabs.sendMessage(msg.tabId, msg)
      break
  }
}

function send<K extends keyof SWMessages>(type: K, data: SWMessages[K]) {
  chrome.runtime.sendMessage({ source: 'pm-dev-tools', type, data })
}

chrome.runtime.onMessage.addListener((msg: any, sender, _sendResponse) => {
  console.log(`Received: ${JSON.stringify(msg)}`)
  console.log('sender: ', sender)
  listener(msg, sender)
  return undefined
})

export {}
