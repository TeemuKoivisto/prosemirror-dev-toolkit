import { get, writable } from 'svelte/store'

import type { FoundInstance } from '../types'

interface Connected {
  devtools: null
  'pm-devtools-sw': chrome.runtime.Port | null
}

export const disabled = writable(false)
export const mounted = writable(false)
export const ports = writable<Record<number, Connected>>({})
export const mountedInstances = writable(new Map<number, FoundInstance[]>())

async function hydrate() {
  const dis = await chrome.storage.sync.get('disabled')
  disabled.set(!!dis)
}

hydrate()

disabled.subscribe(async disable => {
  chrome.storage.sync.set({ disabled: disable }, () => {
    console.log('Is disabled: ' + disable)
  })
})

export const storeActions = {
  toggleDisabled() {
    disabled.update(val => !val)
  }
}
