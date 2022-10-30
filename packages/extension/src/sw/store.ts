import { get, writable } from 'svelte/store'

import type { FoundInstance, SWMessageMap } from '../types'

interface Connected {
  instances: FoundInstance[]
  pagePort: chrome.runtime.Port | undefined
  popUpPort: chrome.runtime.Port | undefined
}

export const disabled = writable(false)
export const mounted = writable(false)
export const ports = writable(new Map<number, Connected>())

hydrate()

async function hydrate() {
  const dis = await chrome.storage.sync.get('disabled')
  disabled.set(!!dis)
}

async function toggleBadge(tabId: number) {
  const prevState = await chrome.action.getBadgeText({ tabId })
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'
  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tabId,
    text: nextState
  })
}

disabled.subscribe(async val => {
  chrome.storage.sync.set({ disabled: val }, () => {
    console.log('Is disabled: ' + val)
  })
  chrome.action.setBadgeText({
    text: val ? 'OFF' : 'ON'
  })
})

export const storeActions = {
  toggleDisabled() {
    const newVal = !get(disabled)
    disabled.update(val => newVal)
    if (!newVal) {
      ports.update(
        p =>
          new Map(Array.from(p.entries()).map(([key, inst]) => [key, { ...inst, instances: [] }]))
      )
    }
    return newVal
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
      disabled: get(disabled),
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
  }
}
