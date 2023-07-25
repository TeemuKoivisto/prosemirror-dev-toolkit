import { get, writable } from 'svelte/store'

import { DEFAULT_POP_UP_STATE } from '../types/consts'
import type { SWMessageMap } from '../types'
import type { PopUpMessageMap, PopUpState } from '../types/pop-up'

export const state = writable<PopUpState>(DEFAULT_POP_UP_STATE)
export const received = writable<SWMessageMap[keyof SWMessageMap][]>([])
export const port = writable<chrome.runtime.Port | undefined>()

const EXAMPLE = {
  source: 'pm-dev-tools' as const,
  origin: 'sw' as const,
  type: 'pop-up-state' as const,
  data: {
    disabled: false,
    showOptions: true,
    showDebug: true,
    devToolsOpts: { devToolsExpanded: false, buttonPosition: 'bottom-right' as const },
    inject: {
      instance: 1,
      selector: '.ProseMirror',
      status: 'finished' as const,
      instances: [
        {
          size: 110,
          element:
            '<p class="">Like this one!</p><p>Try it out by typing in here or see more <a href="examples">examples</a>.</p>'
        },
        {
          size: 240,
          element:
            '<p class="">Like this one!</p><p>Try it out by typing in here or see more <a href="examples">examples</a>.</p>'
        }
      ]
    }
  } as PopUpState
}

export function init() {
  if (chrome.runtime) {
    const created = chrome.runtime.connect({
      name: 'pm-devtools-pop-up'
    })
    created.onMessage.addListener(listenPort)
    created.onDisconnect.addListener(() => {
      port.set(undefined)
    })
    port.set(created)
  } else {
    listenPort(EXAMPLE)
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
      state.set(msg.data)
      break
  }
  received.update(msgs => [...msgs, msg])
}
