import { get } from 'svelte/store'

import { SWMessageType } from '../types'
import { disabled, ports, storeActions } from './store'
import { send } from './send'
import type { Message, FoundInstance, InjectMessages, PopUpMessages, SWMessageMap } from '../types'

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
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  const tab = sender.tab || (await getCurrentTab())
  const tabId = tab.id || 0
  const type = msg.type as keyof InjectMessages | keyof PopUpMessages
  switch (type) {
    case 'reload':
      // chrome.tabs.reload(msg.tabId, { bypassCache: true })
      break
    case 'toggle-disable':
      storeActions.toggleDisabled()
      send(SWMessageType.popUpData, {
        disabled: get(disabled),
        instances: get(ports).get(tabId)?.instances || []
      })
      storeActions.sendToPort(tabId, SWMessageType.injectData, {
        disabled: get(disabled),
        selector: '.ProseMirror'
      })
      break
    case 'mount-pop-up':
      send(SWMessageType.popUpData, {
        disabled: get(disabled),
        instances: get(ports).get(tabId)?.instances || []
      })
      break
    default:
      // chrome.tabs.sendMessage(msg.tabId, msg)
      break
  }
}
