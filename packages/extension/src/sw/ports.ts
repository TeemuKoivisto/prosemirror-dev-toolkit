import { get } from 'svelte/store'

import { disabled, ports, storeActions } from './store'
import type { InjectMessages, PopUpMessageMap } from '../types'
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
    storeActions.sendToPort(tabId, 'pop-up-data', storeActions.getPopUpData(tabId))
  } else if (port.name === 'pm-devtools-page') {
    const tabId = port.sender?.tab?.id
    if (!tabId) {
      console.error('No tab id found for page port!', port)
      return
    }
    storeActions.addPort('page', tabId, port)
    port.onMessage.addListener((msg, port) => listenPort(tabId, msg, port))
    storeActions.sendToPort(tabId, 'inject-data', {
      selector: '.ProseMirror',
      disabled: get(disabled)
    })
  }
}

async function listenPopUpPort<K extends keyof PopUpMessageMap>(
  tabId: number,
  msg: PopUpMessageMap[K],
  port: chrome.runtime.Port
) {
  if (msg.origin !== 'pop-up') {
    return
  }
  console.log('received msg from POP-UP port!', JSON.stringify(msg))
  switch (msg.type) {
    case 'toggle-disable':
      const newDisabled = storeActions.toggleDisabled()
      storeActions.sendToPort(tabId, 'pop-up-data', {
        ...storeActions.getPopUpData(tabId),
        disabled: newDisabled,
        instances: !newDisabled ? get(ports).get(tabId)?.instances || [] : []
      })
      storeActions.sendToPort(tabId, 'inject-data', {
        disabled: newDisabled,
        selector: '.ProseMirror'
      })
      break
    case 'update-state':
      if (msg.data) {
        storeActions.updateState(msg.data)
        storeActions.sendToPort(tabId, 'pop-up-data', storeActions.getPopUpData(tabId))
      }
      break
    case 'mount-pop-up':
      storeActions.sendToPort(tabId, 'pop-up-data', storeActions.getPopUpData(tabId))
      break
  }
}

function listenPort(tabId: number, msg: any, port: chrome.runtime.Port) {
  if (msg.origin !== 'inject') {
    return
  }
  console.log('received msg from PAGE port!', JSON.stringify(msg))
  switch (msg.type) {
    case 'inject-found-instances':
      storeActions.updateInstances(tabId, msg.data)
      break
  }
}

export {}
