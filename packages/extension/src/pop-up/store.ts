import { get, writable } from 'svelte/store'

import { DEFAULT_POP_UP_STATE } from '../types/consts'
import type { SWMessageMap } from '../types'
import type { PopUpMessageMap, PopUpState } from '../types/pop-up'
import { POP_UP_PORT } from '../types/consts'

export const state = writable<PopUpState>(DEFAULT_POP_UP_STATE)
export const received = writable<SWMessageMap[keyof SWMessageMap][]>([])
export const port = writable<chrome.runtime.Port | undefined>()

export function init() {
  if (chrome.runtime) {
    const created = chrome.runtime.connect({
      name: POP_UP_PORT
    })
    created.onMessage.addListener(listenPort)
    created.onDisconnect.addListener(() => {
      port.set(undefined)
    })
    port.set(created)
  } else {
    // When run locally with `vite dev`
    listenPort({
      source: 'pm-dev-tools' as const,
      origin: 'sw' as const,
      type: 'pop-up-state' as const,
      tabId: 0,
      data: DEFAULT_POP_UP_STATE
    })
  }
}

export function send<K extends keyof PopUpMessageMap>(type: K, data: PopUpMessageMap[K]['data']) {
  get(port)?.postMessage({ source: 'pm-dev-tools', origin: 'pop-up', type, data })
}

export function listenPort<K extends keyof SWMessageMap>(msg: SWMessageMap[K]) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  switch (msg.type) {
    case 'pop-up-state':
      // console.error('pop-up-state', JSON.stringify(msg.data))
      state.set(msg.data)
      break
  }
  received.update(msgs => [...msgs, [msg.tabId, msg.data?.data] as any])
}
