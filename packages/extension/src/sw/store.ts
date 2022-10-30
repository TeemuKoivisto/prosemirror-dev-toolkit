import { get, writable } from 'svelte/store'

import type { FoundInstance, SWMessages } from '../types'

interface Connected {
  instances: FoundInstance[]
  port: chrome.runtime.Port
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
    disabled.update(val => !val)
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
  },
  addPort(tabId: number, port: chrome.runtime.Port) {
    ports.update(p =>
      p.set(tabId, {
        instances: [],
        port
      })
    )
    this.sendToPort(tabId, 'inject-data', { selector: '.ProseMirror', disabled: get(disabled) })
  },
  sendToPort<K extends SWMessages['type']>(tabId: number, type: K, data: SWMessages['data']) {
    const port = get(ports).get(tabId)?.port
    if (port) {
      port.postMessage({
        source: 'pm-dev-tools',
        origin: 'sw',
        type,
        data
      })
    }
  }
}
