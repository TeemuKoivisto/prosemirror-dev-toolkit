import { storeActions } from './store'
import type { InjectMessages } from '../types'

export function portListener(port: chrome.runtime.Port) {
  console.log('install on port', port)
  const tabId = port.sender?.tab?.id
  if (tabId === undefined) return
  storeActions.addPort(tabId, port)
  port.onMessage.addListener((msg, port) => listenPort(tabId, msg, port))
}

function listenPort(
  tabId: number,
  msg: {
    type: keyof InjectMessages
    data: InjectMessages[keyof InjectMessages]
  },
  port: chrome.runtime.Port
) {
  console.log('received msg from port!', msg)
  switch (msg.type) {
    case 'found_instances':
      storeActions.updateInstances(tabId, msg.data)
      break
  }
}

export {}
