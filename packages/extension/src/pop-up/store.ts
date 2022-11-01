import { get, derived, writable } from 'svelte/store'

import type { SWMessageMap } from '../types'
import type { PopUpMessageMap, PopUpState } from '../types/pop-up'

export const state = writable<PopUpState>({
  disabled: false,
  showOptions: false,
  showDebug: false,
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: 'bottom-right'
  },
  instances: []
})
export const received = writable<SWMessageMap[keyof SWMessageMap][]>([])
export const disabled = derived(state, s => s.disabled)
export const showOptions = derived(state, s => s.showOptions)
export const showDebug = derived(state, s => s.showDebug)
export const foundInstances = derived(state, s => s.instances)
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

export function send<K extends keyof PopUpMessageMap>(type: K, data: PopUpMessageMap[K]['data']) {
  get(port)?.postMessage({ source: 'pm-dev-tools', origin: 'pop-up', type, data })
}

export function listenPort<K extends keyof SWMessageMap>(msg: SWMessageMap[K]) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  switch (msg.type) {
    case 'pop-up-data':
      state.set(msg.data)
      break
  }
  received.update(msgs => [...msgs, msg])
}
