import { get, derived, writable } from 'svelte/store'

import { getCurrentTab } from './getCurrentTab'
import type {
  DeepPartial,
  GlobalState,
  FoundInstance,
  SWMessageMap,
  InjectStatus,
  PopUpState,
  InjectState,
  InjectData
} from '../types'

interface PageData {
  inject: {
    instance: number
    selector: string
    status: InjectStatus
    instances: FoundInstance[]
  }
  pagePort?: chrome.runtime.Port
  popUpPort?: chrome.runtime.Port
}

const GLOBAL_STATE_KEY = 'pm-dev-tools-global-state'
const DEFAULT_INJECT_DATA = {
  instance: 0,
  selector: '.ProseMirror',
  status: 'finished' as const,
  instances: []
}
const DEFAULT_GLOBAL_STATE: GlobalState = {
  disabled: false,
  showOptions: false,
  showDebug: false,
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: 'bottom-right'
  }
}

export const globalState = writable<GlobalState>(DEFAULT_GLOBAL_STATE)
export const disabled = derived(globalState, s => s.disabled)
export const pages = writable(new Map<number, PageData>())
export const currentTabId = writable<number>(0)
export const currentPage = derived([pages, currentTabId], ([p, c]) => ({
  ...p.get(c),
  inject: {
    ...DEFAULT_INJECT_DATA,
    ...p.get(c)?.inject
  }
}))

hydrate()

async function hydrate() {
  const state = ((await chrome.storage.sync.get()) || {})[GLOBAL_STATE_KEY]
  if (state && typeof state === 'object' && Object.keys(state).length > 0) {
    globalState.set(state)
  }
}

globalState.subscribe(val => {
  chrome.storage.sync.set({ [GLOBAL_STATE_KEY]: val })
})
currentPage.subscribe(val => {
  const iconType = val.inject.instances.length === 0 ? '-disabled' : ''
  chrome.action.setIcon({
    path: {
      '16': chrome.runtime.getURL(`devtools${iconType}-16.png`),
      '32': chrome.runtime.getURL(`devtools${iconType}-32.png`),
      '48': chrome.runtime.getURL(`devtools${iconType}-48.png`),
      '128': chrome.runtime.getURL(`devtools${iconType}-128.png`)
    }
  })
})
chrome.runtime.onInstalled.addListener(() => {
  setTimeout(async () => {
    const tab = await getCurrentTab()
    currentTabId.set(tab?.id || 0)
  }, 1000)
})
chrome.tabs.onActivated.addListener(activeInfo => {
  currentTabId.set(activeInfo.tabId)
})

export const storeActions = {
  toggleDisabled() {
    const newDisabled = !get(disabled)
    globalState.update(s => ({ ...s, disabled: newDisabled }))
    if (newDisabled) {
      pages.update(
        all =>
          new Map(
            Array.from(all.entries()).map(([key, page]) => [
              key,
              {
                ...page,
                inject: {
                  ...page.inject,
                  status: 'finished' as const,
                  instances: []
                }
              }
            ])
          )
      )
    }
  },
  getPageData(tabId: number) {
    return {
      ...get(pages).get(tabId)
    }
  },
  getPopUpData(tabId: number): PopUpState {
    return {
      ...get(globalState),
      inject: {
        ...DEFAULT_INJECT_DATA,
        ...get(currentPage)?.inject
        // ...this.getPageData(tabId).inject
      }
    }
  },
  getInjectData(tabId: number): InjectState {
    const state = get(globalState)
    return {
      disabled: state.disabled,
      devToolsOpts: state.devToolsOpts,
      inject: {
        ...DEFAULT_INJECT_DATA,
        ...get(currentPage)?.inject
        // ...this.getPageData(tabId).inject
      }
    }
  },
  setState(newGlobal: GlobalState | undefined, newPages: Map<number, PageData> | undefined) {
    if (newGlobal) globalState.set(newGlobal)
    if (newPages) pages.set(newPages)
  },
  updateGlobalState(data: DeepPartial<GlobalState>) {
    globalState.update(s => ({
      ...s,
      ...data,
      devToolsOpts: {
        ...s.devToolsOpts,
        ...data.devToolsOpts
      }
    }))
  },
  updatePageInjectData(tabId: number, data: Partial<InjectData>) {
    const old = this.getPageData(tabId)
    pages.update(p =>
      p.set(tabId, { ...old, inject: { ...DEFAULT_INJECT_DATA, ...old.inject, ...data } })
    )
  },
  addPort(type: 'page' | 'pop-up', tabId: number, port: chrome.runtime.Port) {
    pages.update(p => {
      const old = p.get(tabId)
      if (old) {
        return p.set(tabId, {
          ...old,
          pagePort: type === 'page' ? port : old.pagePort,
          popUpPort: type === 'pop-up' ? port : old.popUpPort
        })
      }
      return p.set(tabId, {
        inject: { ...DEFAULT_INJECT_DATA },
        pagePort: type === 'page' ? port : undefined,
        popUpPort: type === 'pop-up' ? port : undefined
      })
    })
  },
  sendToPort<K extends keyof SWMessageMap>(tabId: number, type: K, data: SWMessageMap[K]['data']) {
    const inst = get(pages).get(tabId)
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
  broadcastPopUpData(tabId: number) {
    setTimeout(() => {
      this.sendToPort(tabId, 'pop-up-state', this.getPopUpData(tabId))
    })
  },
  broadcastInjectData(tabId: number) {
    setTimeout(() => {
      this.sendToPort(tabId, 'inject-state', this.getInjectData(tabId))
    })
  },
  broadcastStateUpdate(tabId: number) {
    // In a timeout since when updating stores, the updated values are not returned immediately
    // A bit hackish but I suppose it's all right since the events are already asynchronous
    setTimeout(() => {
      const state = get(globalState)
      const popUpData = {
        ...state,
        inject: {
          ...DEFAULT_INJECT_DATA,
          ...this.getPageData(tabId)?.inject
        }
      }
      const injectData = {
        disabled: popUpData.disabled,
        devToolsOpts: popUpData.devToolsOpts,
        inject: popUpData.inject
      }
      this.sendToPort(tabId, 'pop-up-state', popUpData)
      this.sendToPort(tabId, 'inject-state', injectData)
    })
  },
  disconnectPort(type: 'page' | 'pop-up', tabId: number, port: chrome.runtime.Port) {
    pages.update(p => {
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
