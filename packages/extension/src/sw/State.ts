import {
  DeepPartial,
  DEFAULT_GLOBAL_STATE,
  DEFAULT_INJECT_DATA,
  DEFAULT_INJECT_OPTIONS,
  DEFAULT_INJECT_STATE,
  FoundInstance,
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
import { Observable } from '../utils/Observable'

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
        data
      } as SWMessageMap[K])
      page.popUpPort?.postMessage({
        source: 'pm-dev-tools',
        origin: 'sw',
        type,
        data
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
    switch (event.type) {
      case 'sleeping':
        updated = {
          ...updated,
          ...event.data
        }
        break
      case 'injecting':
        const instances: Record<string, FoundInstance> = {}
        for (let i = 0; i < event.data.elements + event.data.iframes; i += 1) {
          if (i < event.data.elements) {
            instances[`view-${i}`] = {
              type: 'view',
              index: i,
              size: 0,
              element: '',
              status: 'injecting'
            }
          } else {
            instances[`iframe-${i - event.data.elements}`] = {
              type: 'iframe',
              index: i - event.data.elements,
              size: 0,
              element: '',
              status: 'injecting'
            }
          }
        }
        updated = {
          ...updated,
          instances
        }
        break
      case 'view-result':
        const inst = updated.instances[`view-${event.data.index}`]
        if (inst) {
          updated.instances[`view-${event.data.index}`] = {
            ...inst,
            size: event.data.size,
            element: event.data.element
          }
        }
        break
      case 'iframe-result':
        const inst2 = updated.instances[`iframe-${event.data.iframeIndex}`]
        if (inst2) {
          updated.instances[`view-${event.data.iframeIndex}`] = {
            ...inst2,
            size: event.data.size,
            element: event.data.element
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
    this.emit('update', tabId, 'injectData', updated)
  }
}
