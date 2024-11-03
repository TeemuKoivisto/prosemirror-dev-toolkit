import openDevToolsWindow from './openWindow'
import type { InjectMsgMap, PopUpMessageMap } from '../types'
import { getCurrentTab } from './getCurrentTab'
import { PAGE_PORT, POP_UP_PORT } from '../types/consts'
import { State } from './State'

const GLOBAL_STORAGE_KEY = 'pm-dev-tools-global-opts'
const INJECT_STORAGE_KEY = 'pm-dev-tools-inject-opts'
const state = new State()

async function hydrate() {
  const storage = await chrome.storage.sync.get()
  const glb = storage[GLOBAL_STORAGE_KEY]
  const inj = storage[INJECT_STORAGE_KEY]
  const isValid = (found: any) =>
    found && typeof found === 'object' && Object.keys(found).length > 0
  isValid(glb) && state.hydrate('global', glb)
  isValid(inj) && state.hydrate('injectOpts', inj)
}

hydrate()

state.on('update', (tabId, field, value) => {
  if (field === 'global') {
    chrome.storage.sync.set({ [GLOBAL_STORAGE_KEY]: value })
  } else if (field === 'injectOpts') {
    chrome.storage.sync.set({ [INJECT_STORAGE_KEY]: value })
  }
  // @TODO maybe check whether deep equal to previous state -> dont rerun inject
  const popup = state.getPopUpState(tabId)
  const inject = state.getInjectState(tabId)
  state.sendToPort(tabId, 'pop-up-state', popup)
  state.sendToPort(tabId, 'run-inject', inject)
})

// currentPage.subscribe(val => {
//   const iconType = val.inject.instances.length === 0 ? '-disabled' : ''
//   chrome.action.setIcon({
//     path: {
//       '16': chrome.runtime.getURL(`devtools${iconType}-16.png`),
//       '32': chrome.runtime.getURL(`devtools${iconType}-32.png`),
//       '48': chrome.runtime.getURL(`devtools${iconType}-48.png`),
//       '128': chrome.runtime.getURL(`devtools${iconType}-128.png`)
//     }
//   })
// })
// chrome.runtime.onInstalled.addListener(() => {
//   setTimeout(async () => {
//     const tab = await getCurrentTab()
//     currentTabId.set(tab?.id || 0)
//   }, 1000)
// })
// chrome.tabs.onActivated.addListener(activeInfo => {
//   currentTabId.set(activeInfo.tabId)
// })

state.on('portConnected', (type, tabId) => {
  if (type === PAGE_PORT) {
    state.sendToPort(tabId, 'run-inject', state.getInjectState(tabId))
  } else {
    state.sendToPort(tabId, 'pop-up-state', state.getPopUpState(tabId))
  }
})

// storeActions.sendToPort(tabId, 'run-inject', storeActions.getInjectData(tabId))

export async function listenToConnections(port: chrome.runtime.Port) {
  const tabId = port.sender?.tab?.id || (await getCurrentTab())?.id
  if (tabId === undefined) {
    console.error('No tab id found for port!', port)
  } else if (port.name === PAGE_PORT) {
    state.addPort(PAGE_PORT, tabId, port)
    port.onMessage.addListener((msg: any, _port: chrome.runtime.Port) => onInjectMsg(tabId, msg))
  } else if (port.name === POP_UP_PORT) {
    state.addPort(POP_UP_PORT, tabId, port)
    port.onMessage.addListener((msg: any, _port: chrome.runtime.Port) => onPopUpMsg(tabId, msg))
  } else {
    console.error('Unknown port connected: ', port.name)
  }
}

function onInjectMsg<K extends keyof InjectMsgMap>(tabId: number, msg: InjectMsgMap[K]) {
  if (msg.origin !== 'inject') {
    // Receives also events from itself
    return
  }
  console.log('inject', msg.type)
  switch (msg.type) {
    // case 'inject-progress':
    //   storeActions.updatePageInjectData(tabId, { status: msg.data })
    //   storeActions.broadcastPopUpData(tabId)
    //   break
    // case 'inject-found':
    //   storeActions.updatePageInjectData(tabId, {
    //     instances: msg.data.instances,
    //     status: 'finished'
    //   })
    //   storeActions.broadcastPopUpData(tabId)
    //   break
    case 'inject-event':
      // storeActions.
      state.handleInjectEvent(tabId, msg.data)
      break
    case 'inject-finished':
      break
    case 'inject-errored':
      break
  }
}

async function onPopUpMsg<K extends keyof PopUpMessageMap>(tabId: number, msg: PopUpMessageMap[K]) {
  if (msg.origin !== 'pop-up') {
    // Receives also events from itself
    return
  }
  console.log('pop-up', msg.type)
  switch (msg.type) {
    case 'toggle-disable':
      state.toggleDisabled(tabId)
      break
    case 'reapply-devtools':
      state.sendToPort(tabId, 'rerun-inject', undefined)
      break
    case 'update-global-options':
      state.updateGlobalOptions(msg.data, tabId)
      break
    case 'update-inject-options':
      state.updateInjectOptions(msg.data, tabId)
      break
    case 'mount-pop-up':
      state.sendToPort(tabId, 'pop-up-state', state.getPopUpState(tabId))
      break
    case 'open-in-window':
      openDevToolsWindow('devtools-panel')
      break
  }
}
