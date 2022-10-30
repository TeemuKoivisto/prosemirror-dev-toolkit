import { get } from 'svelte/store'

import type {
  Message,
  FoundInstance,
  InjectMessages,
  PopUpMessages,
  SWMessages,
  SWMessageMap
} from '../types'
import { disabled, mountedInstances, storeActions } from './store'
import { send } from './send'

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
})

// https://developer.chrome.com/docs/extensions/reference/tabs/#get-the-current-tab
async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

export async function listener<K extends keyof InjectMessages & keyof PopUpMessages>(
  msg: { source: string; type: K; data: InjectMessages[K] | PopUpMessages[K] },
  sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: any) => void
) {
  console.log(`Received: ${JSON.stringify(msg)}`)
  console.log('sender: ', sender)
  if (!('source' in msg) || msg.source !== 'pm-dev-tools') return
  const tab = sender.tab || (await getCurrentTab())
  console.log('tab', tab)
  const type = msg.type as keyof InjectMessages | keyof PopUpMessages
  switch (type) {
    case 'reload':
      // chrome.tabs.reload(msg.tabId, { bypassCache: true })
      break
    case 'badge':
      toggleBadge(sender.tab?.id as number)
      storeActions.toggleDisabled()
      break
    case 'toggle-disable':
      storeActions.toggleDisabled()
      send('pop-up-data', {
        disabled: get(disabled),
        instances: get(mountedInstances).get(tab.id || 0) || []
      })
      break
    case 'mount-pop-up':
      send('pop-up-data', {
        disabled: get(disabled),
        instances: get(mountedInstances).get(tab.id || 0) || []
      })
      break
    default:
      // chrome.tabs.sendMessage(msg.tabId, msg)
      break
  }
}
