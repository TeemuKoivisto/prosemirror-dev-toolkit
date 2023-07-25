import { applyDevTools, removeDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import type { InjectMessageMap, InjectState, InjectStatus, SWMessageMap } from '../types'

export function send<K extends keyof InjectMessageMap>(type: K, data: InjectMessageMap[K]['data']) {
  window.postMessage({ source: 'pm-dev-tools', origin: 'inject', type, data })
}
