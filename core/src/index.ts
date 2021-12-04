import type { Transaction } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { Plugin } from './typings/pm'
import type { applyDevTools } from './applyDevTools'

declare global {
  interface Window {
    applyDevTools: typeof applyDevTools
    editorView?: EditorView
    _node?: any
    _doc?: { [key: string]: any }
    _trs?: Transaction[]
    _plugin?: [Plugin | undefined, unknown]
  }
}

export { applyDevTools, removeDevTools } from './applyDevTools'
export * from './types'
