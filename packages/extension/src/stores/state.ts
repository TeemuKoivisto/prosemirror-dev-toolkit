import { derived, get, writable } from 'svelte/store'

import type { Message } from '../types'

export type StateStore = ReturnType<typeof createStateStore>

export const createStateStore = () => {
  console.log('createStateStore')

  const isActive = writable(false)
  const foundInstances = writable(0)

  const port = chrome.runtime.connect({ name: 'pm-tab' })

  port.onMessage.addListener(ev => {
    console.log('port received message: ', ev)
    switch (ev.type) {
      case 'injected':
        isActive.set(!get(isActive))
        console.log('mounted!', ev.data)
        console.log('isActive', get(isActive))
        break
    }
  })

  window.addEventListener('message', ev => {
    console.log('window received message: ', ev)
    if ('type' in ev.data) {
      const msg = ev.data as Message
      switch (msg.type) {
        case 'injected':
          console.log('set mounted to:', msg.data)
          isActive.set(!get(isActive))
          foundInstances.set(msg.data)
          console.log('mounted!', msg.data)
          console.log('isActive', get(isActive))
          break
      }
    }
  })

  chrome.runtime.onMessage.addListener((msg: Message, sender, sendResponse) => {
    console.log('chrome msg', msg)
  })

  return {
    isActive,
    foundInstances
  }
}
