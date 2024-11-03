import { Observable } from '../utils/Observable'
import {
  DeepPartial,
  DEFAULT_GLOBAL_STATE,
  DEFAULT_INJECT_DATA,
  DEFAULT_INJECT_OPTIONS,
  GlobalState,
  InjectData,
  InjectEvent,
  InjectOptions,
  InjectState,
  PAGE_PORT,
  PageData,
  POP_UP_PORT,
  PopUpState,
  SWMessageMap
} from '../types'

interface MutableData {
  global: GlobalState
  injectOpts: InjectOptions
  injectData: InjectData
  currentTab: InjectData
}
type UpdateArgs = {
  [K in keyof MutableData]: [tabId: number, field: K, value: MutableData[K]]
}[keyof MutableData]

type StateEvents = {
  created(): void
  hydrated(): void
  update(...[tabId, field, value]: UpdateArgs): void
  portConnected(type: typeof PAGE_PORT | typeof POP_UP_PORT, tabId: number): void
  portDisconnected(type: typeof PAGE_PORT | typeof POP_UP_PORT, tabId: number): void
  destroy(): void
}

export class State extends Observable<StateEvents> {
  global: GlobalState = DEFAULT_GLOBAL_STATE
  inject: InjectOptions = DEFAULT_INJECT_OPTIONS
  pages = new Map<number, PageData>()
  currentTabId = 0

  getPopUpState(tabId: number): PopUpState {
    const found = this.pages.get(tabId)?.injectData
    return {
      global: this.global,
      inject: this.inject,
      data: found ?? DEFAULT_INJECT_DATA
    }
  }

  getInjectState(tabId: number): InjectState {
    const found = this.pages.get(tabId)?.injectData
    return {
      global: this.global,
      inject: this.inject,
      data: found ?? DEFAULT_INJECT_DATA
    }
  }

  hydrate(state: 'global' | 'injectOpts', data: any) {
    if (state === 'global') {
      this.global = data
    } else if (state === 'injectOpts') {
      this.inject = data
    }
  }

  setCurrentTab(tabId: number) {
    this.currentTabId = tabId
    const old = this.pages.get(tabId)
    const page = old ?? {
      injectData: { ...DEFAULT_INJECT_DATA },
      pagePort: undefined,
      popUpPort: undefined
    }
    this.pages.set(tabId, page)
    this.emit('update', tabId, 'currentTab', page.injectData)
  }

  /**
   * Adds port, a Chrome specific event listener, for an opened tab
   *
   * @param type
   * @param tabId
   * @param port
   */
  addPort(type: typeof PAGE_PORT | typeof POP_UP_PORT, tabId: number, port: chrome.runtime.Port) {
    const old = this.pages.get(tabId)
    if (old) {
      this.pages.set(tabId, {
        ...old,
        pagePort: type === PAGE_PORT ? port : old.pagePort,
        popUpPort: type === POP_UP_PORT ? port : old.popUpPort
      })
    } else {
      this.pages.set(tabId, {
        injectData: { ...DEFAULT_INJECT_DATA },
        pagePort: type === PAGE_PORT ? port : undefined,
        popUpPort: type === POP_UP_PORT ? port : undefined
      })
    }
    this.emit('portConnected', type, tabId)
    port.onDisconnect.addListener(() => this.disconnectPort(type, tabId))
    // port.onMessage.addListener((msg: any, _port: chrome.runtime.Port) => listenInject(tabId, msg))
  }

  disconnectPort(type: typeof PAGE_PORT | typeof POP_UP_PORT, tabId: number) {
    const old = this.pages.get(tabId)
    if (old) {
      this.pages.set(tabId, {
        ...old,
        pagePort: type === PAGE_PORT ? undefined : old.pagePort,
        popUpPort: type === POP_UP_PORT ? undefined : old.popUpPort
      })
      this.emit('portDisconnected', type, tabId)
    }
  }

  sendToPort<K extends keyof SWMessageMap>(tabId: number, type: K, data: SWMessageMap[K]['data']) {
    const page = this.pages.get(tabId)
    if (page) {
      page.pagePort?.postMessage({
        source: 'pm-dev-tools',
        origin: 'sw',
        type,
        data,
        tabId
      } as SWMessageMap[K])
      page.popUpPort?.postMessage({
        source: 'pm-dev-tools',
        origin: 'sw',
        type,
        data,
        tabId
      } as SWMessageMap[K])
    }
  }

  updateGlobalOptions(opts: DeepPartial<GlobalState>, tabId: number) {
    this.global = {
      ...this.global,
      ...opts,
      devToolsOpts: {
        ...this.global.devToolsOpts,
        ...opts.devToolsOpts
      }
    }
    this.emit('update', tabId, 'global', this.global)
  }

  updateInjectOptions(opts: Partial<InjectOptions>, tabId: number) {
    this.inject = {
      ...this.inject,
      ...opts
    }
    this.emit('update', tabId, 'injectOpts', this.inject)
  }

  toggleDisabled(tabId: number) {
    const newDisabled = !this.global.disabled
    this.global.disabled = newDisabled
    if (newDisabled) {
      this.pages = new Map(
        this.pages.entries().map(([key, page]) => [
          key,
          {
            ...page,
            injectData: DEFAULT_INJECT_DATA
          }
        ])
      )
    }
    this.emit('update', tabId, 'global', this.global)
    // @TODO emit update pages(?) inject(?)
  }

  selectViewInstance(index: number) {}

  handleInjectEvent(tabId: number, event: InjectEvent) {
    const old = this.pages.get(tabId)
    if (!old) return
    let updated: InjectData = old.injectData
    const { type, data } = event
    switch (type) {
      case 'sleeping':
        updated = {
          ...updated,
          ...data
        }
        break
      case 'view-instance':
        const id2 =
          data.type === 'view' ? `view-${data.index}` : `iframe-${data.iframeIndex}-${data.index}`
        const instances = { ...updated.instances, [id2]: data }
        updated = {
          ...updated,
          instances
        }
        break
      case 'view-result':
        const id =
          data.type === 'view' ? `view-${data.index}` : `iframe-${data.iframeIndex}-${data.index}`
        const inst = updated.instances[id]
        if (inst) {
          updated.instances[id] = {
            ...inst,
            ...data
          }
        }
        break
      case 'error':
        updated = {
          ...updated,
          status: 'error'
        }
        break
      case 'finished':
        updated = {
          ...updated,
          status: 'finished'
        }
        break
    }
    const page = { ...old, injectData: updated }
    this.pages.set(tabId, page)
    setTimeout(() => {
      this.emit('update', tabId, 'injectData', updated)
    })
  }
}
