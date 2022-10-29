import type { Message } from './types'

export function sendMessage(msg: Message) {
  return chrome.runtime.sendMessage(msg)
}
