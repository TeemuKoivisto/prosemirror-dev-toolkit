import { get } from 'svelte/store'

import { disabled, ports, storeActions } from './store'
import type { InjectMessages } from '../types'
import { getCurrentTab } from './getCurrentTab'

export async function listenToConnections(port: chrome.runtime.Port) {
  console.log('install on port', port)
  if (port.name === 'pm-devtools-pop-up') {
    const tab = await getCurrentTab()
    const tabId = tab.id
    if (!tabId) {
      console.error('No tab id found for pop-up port!', port)
      return
    }
    storeActions.addPort('pop-up', tabId, port)
    port.onMessage.addListener((msg, port) => listenPopUpPort(tabId, msg, port))
  } else if (port.name === 'pm-devtools-page') {
    const tabId = port.sender?.tab?.id
    if (!tabId) {
      console.error('No tab id found for page port!', port)
      return
    }
    storeActions.addPort('page', tabId, port)
    port.onMessage.addListener((msg, port) => listenPort(tabId, msg, port))
  }
}

async function listenPopUpPort(
  tabId: number,
  msg: {
    type: any
    data: any
  },
  port: chrome.runtime.Port
) {
  console.log('received msg from POP-UP port!', JSON.stringify(msg))
  switch (msg.type) {
    case 'toggle-disable':
      storeActions.toggleDisabled()
      storeActions.sendToPort(tabId, 'pop-up-data', {
        disabled: get(disabled),
        instances: get(ports).get(tabId)?.instances || []
      })
      storeActions.sendToPort(tabId, 'inject-data', {
        disabled: get(disabled),
        selector: '.ProseMirror'
      })
      break
    case 'mount-pop-up':
      storeActions.sendToPort(tabId, 'pop-up-data', {
        disabled: get(disabled),
        instances: get(ports).get(tabId)?.instances || []
      })
      break
  }
}

function listenPort(
  tabId: number,
  msg: {
    type: any
    data: any
  },
  port: chrome.runtime.Port
) {
  console.log('received msg from PAGE port!', JSON.stringify(msg))
  switch (msg.type) {
    case 'inject-found-instances':
      storeActions.updateInstances(tabId, msg.data)
      break
  }
}

export {}
