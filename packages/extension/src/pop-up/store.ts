import { get, derived, writable } from 'svelte/store'

import type { FoundInstance, PopUpMessages, SWMessageMap } from '../types'

export const received = writable<SWMessageMap[keyof SWMessageMap][]>([])
export const disabled = writable(false)
export const showOptions = writable(false)
export const showDebug = writable(false)
export const foundInstances = writable<FoundInstance[]>([])
export const port = writable<chrome.runtime.Port | undefined>()
export const connected = derived(port, p => !!p)

export function init() {
  const created = chrome.runtime.connect({
    name: 'pm-devtools-pop-up'
  })
  created.onMessage.addListener(listenPort)
  created.onDisconnect.addListener(() => {
    port.set(undefined)
  })
  port.set(created)
}

export function send<K extends keyof PopUpMessages>(type: K, data: PopUpMessages[K]) {
  get(port)?.postMessage({ source: 'pm-dev-tools', origin: 'pop-up', type, data })
}

export function listenPort<K extends keyof SWMessageMap>(msg: SWMessageMap[K]) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  switch (msg.type) {
    case 'pop-up-data':
      disabled.set(msg.data.disabled)
      foundInstances.set(msg.data.instances)
      break
  }
  received.update(msgs => [...msgs, msg])
}
