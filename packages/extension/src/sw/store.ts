import { get, derived, writable } from 'svelte/store'

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

const STORAGE_KEY = 'pm-dev-tools-global-state'
const DEFAULT_INJECT_DATA = {
  instance: 0,
  selector: '.ProseMirror',
  status: 'no-instances' as const,
  instances: []
}
const DEFAULT_GLOBAL_STATE: GlobalState = {
  disabled: false,
  showOptions: false,
  showDebug: false,
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: 'bottom-right'
  },
  defaultInject: {
    selector: '.ProseMirror'
  }
}

export const globalState = writable<GlobalState>(DEFAULT_GLOBAL_STATE)
export const disabled = derived(globalState, s => s.disabled)
export const pages = writable(new Map<number, PageData>())

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
      pages.update(
        p =>
          new Map(Array.from(p.entries()).map(([key, inst]) => [key, { ...inst, instances: [] }]))
      )
    }
    return newVal
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
        ...this.getPageData(tabId).inject
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
        ...this.getPageData(tabId).inject
      }
    }
  },
  updateGlobalState(data: DeepPartial<GlobalState>) {
    globalState.update(s => ({
      ...s,
      ...data,
      devToolsOpts: {
        ...s.devToolsOpts,
        ...data.devToolsOpts
      },
      defaultInject: {
        ...s.defaultInject,
        ...data.defaultInject
      }
    }))
  },
  updatePageInjectData(tabId: number, data: Partial<InjectData>) {
    const old = this.getPageData(tabId)
    pages.update(p =>
      p.set(tabId, { ...old, inject: { ...DEFAULT_INJECT_DATA, ...old.inject, ...data } })
    )
  },
  updateInstances(tabId: number, instances: FoundInstance[]) {
    const old = this.getPageData(tabId)
    const updated: PageData = {
      ...old,
      inject: {
        ...DEFAULT_INJECT_DATA,
        ...old.inject,
        instances,
        status: 'found-instances' as const
      }
    }
    pages.update(p => p.set(tabId, updated))
    const state = get(globalState)
    this.sendToPort(tabId, 'pop-up-state', {
      ...state,
      inject: updated.inject
    })
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
  broadcastStateUpdate(tabId: number) {
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
