import type { SWMessageMap } from '../types'

export function send<K extends keyof SWMessageMap>(type: K, data: SWMessageMap[K]['data']) {
  chrome.runtime.sendMessage({
    source: 'pm-dev-tools',
    origin: 'sw',
    type,
    data
  } as SWMessageMap[K])
}
