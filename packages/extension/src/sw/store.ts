import { get, derived, writable } from 'svelte/store'

import type { GlobalState, FoundInstance, SWMessageMap } from '../types'

interface Connected {
  instances: FoundInstance[]
  pagePort: chrome.runtime.Port | undefined
  popUpPort: chrome.runtime.Port | undefined
}

const STORAGE_KEY = 'pm-dev-tools-global-state'
const DEFAULT_GLOBAL_STATE: GlobalState = {
  disabled: false,
  showOptions: false,
  showDebug: false,
  selector: '.ProseMirror',
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: 'bottom-right'
  }
}

export const globalState = writable<GlobalState>(DEFAULT_GLOBAL_STATE)
export const disabled = derived(globalState, s => s.disabled)
export const ports = writable(new Map<number, Connected>())

hydrate()

async function hydrate() {
  const state = await chrome.storage.sync.get(STORAGE_KEY)
  if (state && typeof state[STORAGE_KEY] === 'object') {
    globalState.set(state[STORAGE_KEY] as any)
  }
}

globalState.subscribe(async val => {
  chrome.storage.sync.set({ STORAGE_KEY: val })
  // TODO use tabId for disabling?
  const iconType = val.disabled ? '-disabled' : ''
  chrome.action.setIcon({
    path: {
      '16': chrome.runtime.getURL(`devtools${iconType}-16.png`),
      '32': chrome.runtime.getURL(`devtools${iconType}-32.png`),
      '48': chrome.runtime.getURL(`devtools${iconType}-48.png`),
      '128': chrome.runtime.getURL(`devtools${iconType}-128.png`)
    }
  })
})

export const storeActions = {
  toggleDisabled() {
    const newVal = !get(disabled)
    globalState.update(s => ({ ...s, disabled: newVal }))
    if (!newVal) {
      ports.update(
        p =>
          new Map(Array.from(p.entries()).map(([key, inst]) => [key, { ...inst, instances: [] }]))
      )
    }
    return newVal
  },
  getPopUpData(tabId: number) {
    return {
      ...get(globalState),
      instances: get(ports).get(tabId)?.instances || []
    }
  },
  updateState(data: Partial<GlobalState>) {
    globalState.update(s => ({
      ...s,
      ...data,
      devToolsOpts: {
        ...s.devToolsOpts,
        ...data.devToolsOpts
      }
    }))
  },
  getInstances(tabId: number) {
    return get(ports).get(tabId)?.instances || []
  },
  updateInstances(tabId: number, instances: FoundInstance[]) {
    ports.update(p => {
      const prev = p.get(tabId)
      if (prev) {
        return p.set(tabId, {
          ...prev,
          instances
        })
      }
      return p
    })
    this.sendToPort(tabId, 'pop-up-data', {
      ...this.getPopUpData(tabId),
      instances
    })
  },
  addPort(type: 'page' | 'pop-up', tabId: number, port: chrome.runtime.Port) {
    ports.update(p => {
      const old = p.get(tabId)
      if (old) {
        return p.set(tabId, {
          ...old,
          pagePort: type === 'page' ? port : old.pagePort,
          popUpPort: type === 'pop-up' ? port : old.popUpPort
        })
      }
      return p.set(tabId, {
        instances: [],
        pagePort: type === 'page' ? port : undefined,
        popUpPort: type === 'pop-up' ? port : undefined
      })
    })
  },
  sendToPort<K extends keyof SWMessageMap>(tabId: number, type: K, data: SWMessageMap[K]['data']) {
    const inst = get(ports).get(tabId)
    if (inst) {
      inst.pagePort?.postMessage({
        source: 'pm-dev-tools',
        origin: 'sw',
        type,
        data
      } as SWMessageMap[K])
      inst.popUpPort?.postMessage({
        source: 'pm-dev-tools',
        origin: 'sw',
        type,
        data
      } as SWMessageMap[K])
    }
  },
  broadcastStateUpdate(tabId: number) {
    const state = get(globalState)
    this.sendToPort(tabId, 'pop-up-data', {
      ...state,
      instances: this.getInstances(tabId)
    })
    this.sendToPort(tabId, 'inject-data', state)
  },
  disconnectPort(type: 'page' | 'pop-up', tabId: number, port: chrome.runtime.Port) {
    ports.update(p => {
      const old = p.get(tabId)
      if (old) {
        return p.set(tabId, {
          ...old,
          pagePort: type === 'page' ? undefined : old.pagePort,
          popUpPort: type === 'pop-up' ? undefined : old.popUpPort
        })
      }
      return p
    })
  }
}
