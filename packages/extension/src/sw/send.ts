import type { Message, FoundInstance, InjectMessages, SWMessages, SWMessageMap } from '../types'

export function send<K extends SWMessages>(type: K['type'], data: K['data']) {
  chrome.runtime.sendMessage({ source: 'pm-dev-tools', origin: 'sw', type, data })
}

// export function send<K extends keyof SWMessageMap>(type: K, data: SWMessageMap[K]) {
//   chrome.runtime.sendMessage({ source: 'pm-dev-tools', origin: 'sw', type, data })
// }
