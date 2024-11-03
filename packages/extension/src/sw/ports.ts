import openDevToolsWindow from './openWindow'
import { storeActions } from './store'
import type { InjectMsgMap, PopUpMessageMap } from '../types'
import { getCurrentTab } from './getCurrentTab'
import { PAGE_PORT, POP_UP_PORT } from '../types/consts'

export async function listenToConnections(port: chrome.runtime.Port) {
  const tabId = port.sender?.tab?.id || (await getCurrentTab())?.id
  if (tabId === undefined) {
    console.error('No tab id found for port!', port)
    return
  }
  switch (port.name) {
    case PAGE_PORT:
      storeActions.addPort(PAGE_PORT, tabId, port)
      port.onDisconnect.addListener(() => storeActions.disconnectPort(PAGE_PORT, tabId, port))
      port.onMessage.addListener((msg: any, _port: chrome.runtime.Port) => listenInject(tabId, msg))
      storeActions.sendToPort(tabId, 'run-inject', storeActions.getInjectData(tabId))
      break
    case POP_UP_PORT:
      storeActions.addPort(POP_UP_PORT, tabId, port)
      port.onDisconnect.addListener(() => storeActions.disconnectPort(POP_UP_PORT, tabId, port))
      port.onMessage.addListener((msg: any, _port: chrome.runtime.Port) => listenPopUp(tabId, msg))
      storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
      break
  }
}

async function listenInject<K extends keyof InjectMsgMap>(tabId: number, msg: InjectMsgMap[K]) {
  if (msg.origin !== 'inject') {
    return
  }
  // console.log('received msg from INJECT port!', JSON.stringify(msg))
  switch (msg.type) {
    case 'inject-status':
      storeActions.updatePageInjectData(tabId, { status: msg.data })
      storeActions.broadcastPopUpData(tabId)
      break
    case 'inject-found':
      storeActions.updatePageInjectData(tabId, {
        instances: msg.data.instances,
        status: 'finished'
      })
      storeActions.broadcastPopUpData(tabId)
      break
    case 'inject-event':
      // storeActions.
      break
    case 'inject-finished':
      break
    case 'inject-errored':
      break
  }
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
      storeActions.toggleDisabled()
      storeActions.broadcastStateUpdate(tabId)
      break
    case 'reapply-devtools':
      storeActions.sendToPort(tabId, 'rerun-inject', undefined)
      break
    case 'update-global-options':
      if (msg.data) {
        storeActions.updateGlobalState(msg.data)
        storeActions.broadcastStateUpdate(tabId)
      }
      break
    case 'update-inject-options':
      if (msg.data) {
        storeActions.updatePageInjectData(tabId, msg.data)
        storeActions.broadcastStateUpdate(tabId)
      }
      break
    case 'mount-pop-up':
      storeActions.sendToPort(tabId, 'pop-up-state', storeActions.getPopUpData(tabId))
      break
    case 'open-in-window':
      openDevToolsWindow('devtools-panel')
      break
  }
}
