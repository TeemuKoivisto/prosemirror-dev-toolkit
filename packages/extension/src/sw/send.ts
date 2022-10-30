import type { Message, FoundInstance, InjectMessages, PopUpMessages, SWMessageMap } from '../types'

export function send<K extends keyof SWMessageMap>(type: K, data: SWMessageMap[K]) {
  chrome.runtime.sendMessage({ source: 'pm-dev-tools', origin: 'sw', type, data })
}
