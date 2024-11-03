import openDevToolsWindow from './openWindow'
import type { FoundInstance, InjectMsg, PopUpMessageMap } from '../types'
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

chrome.runtime.onInstalled.addListener(() => {
  setTimeout(async () => {
    const tab = await getCurrentTab()
    state.setCurrentTab(tab?.id || 0)
  }, 1000)
})

chrome.tabs.onActivated.addListener(activeInfo => {
  state.setCurrentTab(activeInfo.tabId)
})

state.on('update', (tabId, field, value) => {
  console.log(`update ${tabId} ${field}`, value)
  switch (field) {
    case 'global':
      chrome.storage.sync.set({ [GLOBAL_STORAGE_KEY]: value })
      state.sendToPort(tabId, 'pop-up-state', state.getPopUpState(tabId))
      state.sendToPort(tabId, 'run-inject', state.getInjectState(tabId))
      break
    case 'injectOpts':
      chrome.storage.sync.set({ [INJECT_STORAGE_KEY]: value })
      state.sendToPort(tabId, 'pop-up-state', state.getPopUpState(tabId))
      // @TODO maybe check whether deep equal to previous state -> dont rerun inject
      // although there's shouldRerun check in there
      state.sendToPort(tabId, 'run-inject', state.getInjectState(tabId))
      break
    case 'injectData':
      state.sendToPort(tabId, 'pop-up-state', state.getPopUpState(tabId))
      break
    case 'currentTab':
      const iconType = Object.keys(value.instances).length === 0 ? '-disabled' : ''
      chrome.action.setIcon({
        path: {
          '16': chrome.runtime.getURL(`devtools${iconType}-16.png`),
          '32': chrome.runtime.getURL(`devtools${iconType}-32.png`),
          '48': chrome.runtime.getURL(`devtools${iconType}-48.png`),
          '128': chrome.runtime.getURL(`devtools${iconType}-128.png`)
        }
      })
      break
  }
})

state.on('portConnected', (type, tabId) => {
  if (type === PAGE_PORT) {
    state.sendToPort(tabId, 'run-inject', state.getInjectState(tabId))
  } else {
    state.sendToPort(tabId, 'pop-up-state', state.getPopUpState(tabId))
  }
})

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

const getId = (inst: FoundInstance) =>
  inst.type === 'view' ? `view-${inst.index}` : `iframe-${inst.iframeIndex}-${inst.index}`

function onInjectMsg(tabId: number, msg: InjectMsg) {
  if (msg.origin !== 'inject') {
    // Receives also events from itself
    return
  }
  console.log('inject', msg.type)
  switch (msg.type) {
    case 'sleeping':
      state.updatePageData(tabId, { status: 'sleeping', ...msg.data })
      break
    case 'injecting':
      state.updatePageData(tabId, { status: 'injecting' })
      break
    case 'view-instance':
      state.updatePageInstance(tabId, getId(msg.data), msg.data)
      break
    case 'view-result':
      state.updatePageInstance(tabId, getId(msg.data), msg.data)
      break
    case 'error':
      state.updatePageData(tabId, { status: 'error' })
      break
    case 'finished':
      state.updatePageData(tabId, { status: 'finished' })
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
      console.log(`mount-pop-up ${tabId}`, JSON.stringify(state.getPopUpState(tabId)))
      state.sendToPort(tabId, 'pop-up-state', state.getPopUpState(tabId))
      break
    case 'open-in-window':
      openDevToolsWindow('devtools-panel')
      break
  }
}
