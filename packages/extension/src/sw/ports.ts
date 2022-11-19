import { storeActions } from './store'
import type { InjectData, InjectMessageMap, PopUpMessageMap } from '../types'
import { getCurrentTab } from './getCurrentTab'

export async function listenToConnections(port: chrome.runtime.Port) {
  const tabId = port.sender?.tab?.id || (await getCurrentTab())?.id
  if (!tabId) {
    console.error('No tab id found for port!', port)
    return
  }
  const { name } = port
  const shortName = name === 'pm-devtools-pop-up' ? 'pop-up' : 'page'
  const listener =
    name === 'pm-devtools-pop-up'
      ? (msg: any, _port: chrome.runtime.Port) => listenPopUp(tabId, msg)
      : (msg: any, _port: chrome.runtime.Port) => listenInject(tabId, msg)
  storeActions.addPort(shortName, tabId, port)
  port.onDisconnect.addListener(() => storeActions.disconnectPort(shortName, tabId, port))
  port.onMessage.addListener(listener)
  if (name === 'pm-devtools-pop-up') {
    storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
  } else if (port.name === 'pm-devtools-page') {
    storeActions.sendToPort(tabId, 'inject-state', storeActions.getInjectData(tabId))
  }
  // storeActions.broadcastStateUpdate(tabId)
}

async function listenPopUp<K extends keyof PopUpMessageMap>(
  tabId: number,
  msg: PopUpMessageMap[K]
) {
  if (msg.origin !== 'pop-up') {
    return
  }
  // console.log('received msg from POP-UP port!', JSON.stringify(msg))
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
  msg: InjectMessageMap[K]
) {
  if (msg.origin !== 'inject') {
    return
  }
  // console.log('received msg from INJECT port!', JSON.stringify(msg))
  switch (msg.type) {
    case 'inject-found-instances':
      storeActions.updateInstances(tabId, msg.data.instances)
      // storeActions.updatePageInjectData(tabId, { instances: msg.data.instances })
      // storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
      setTimeout(() => {
        storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
      })
      break
    case 'inject-status':
      storeActions.updatePageInjectData(tabId, { status: msg.data })
      setTimeout(() => {
        storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
      })
      break
  }
}
