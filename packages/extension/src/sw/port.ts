import { get } from 'svelte/store'

import { disabled, storeActions } from './store'
import type {
  Message,
  FoundInstance,
  InjectMessages,
  PopUpMessages,
  SWMessages,
  SWMessageMap
} from '../types'
import { ports as portsStore, mountedInstances } from './store'

export function send<K extends SWMessages['type']>(
  port: chrome.runtime.Port,
  type: K,
  data: SWMessages['data']
) {
  port.postMessage({
    source: 'pm-dev-tools',
    origin: 'sw',
    type,
    data
  })
}

export function portListener(port: chrome.runtime.Port) {
  console.log('install on port', port)
  if (port.sender?.tab?.id === undefined) return
  const tabId = port.sender.tab.id
  const ports = get(portsStore)
  if (!ports[tabId]) {
    portsStore.update(p => ({
      ...p,
      [tabId]: {
        devtools: null,
        'pm-devtools-sw': port
      }
    }))
  }
  send(port, 'inject-data', { selector: '.ProseMirror', disabled: get(disabled) })
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
      mountedInstances.update(m => m.set(tabId, msg.data))
      break
  }
}

export {}
