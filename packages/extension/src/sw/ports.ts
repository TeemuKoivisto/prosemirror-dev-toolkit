import { get } from 'svelte/store'

import { storeActions } from './store'
import type { InjectData, InjectMessageMap, InjectState, PopUpMessageMap } from '../types'
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
    port.onMessage.addListener((msg, port) => listenPopUp(tabId, msg, port))
    port.onDisconnect.addListener(() => storeActions.disconnectPort('pop-up', tabId, port))
    storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
  } else if (port.name === 'pm-devtools-page') {
    const tabId = port.sender?.tab?.id
    if (!tabId) {
      console.error('No tab id found for page port!', port)
      return
    }
    storeActions.addPort('page', tabId, port)
    port.onMessage.addListener((msg, port) => listenInject(tabId, msg, port))
    port.onDisconnect.addListener(() => storeActions.disconnectPort('page', tabId, port))
    storeActions.sendToPort(tabId, 'inject-state', storeActions.getInjectData(tabId))
  }
}

async function listenPopUp<K extends keyof PopUpMessageMap>(
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
      const { newGlobal, newPages } = storeActions.toggleDisabled()
      storeActions.setState(newGlobal, newPages)
      const inject = {
        ...newPages.get(tabId)?.inject
      } as InjectData
      storeActions.sendToPort(tabId, 'pop-up-state', {
        ...newGlobal,
        inject
      })
      storeActions.sendToPort(tabId, 'inject-state', {
        disabled: newGlobal.disabled,
        devToolsOpts: newGlobal.devToolsOpts,
        inject: inject
      })
      break
    case 'reapply-devtools':
      storeActions.sendToPort(tabId, 'rerun-inject', undefined)
      break
    case 'update-global-data':
      if (msg.data) {
        storeActions.updateGlobalState(msg.data)
        storeActions.broadcastStateUpdate(tabId)
      }
      break
    case 'update-page-data':
      if (msg.data) {
        storeActions.updatePageInjectData(tabId, msg.data)
        storeActions.broadcastStateUpdate(tabId)
      }
      break
    case 'mount-pop-up':
      storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
      break
  }
}

async function listenInject<K extends keyof InjectMessageMap>(
  tabId: number,
  msg: InjectMessageMap[K],
  port: chrome.runtime.Port
) {
  if (msg.origin !== 'inject') {
    return
  }
  console.log('received msg from INJECT port!', JSON.stringify(msg))
  switch (msg.type) {
    case 'inject-found-instances':
      storeActions.updateInstances(tabId, msg.data.instances)
      // storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
      break
    case 'inject-status':
      storeActions.updatePageInjectData(tabId, { status: msg.data })
      storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
      break
  }
}
