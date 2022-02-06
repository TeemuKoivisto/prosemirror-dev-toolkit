import type { Node as PMNode } from 'prosemirror-model'
import type { Transaction } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { Plugin } from './typings/pm'
import type { applyDevTools } from './applyDevTools'

declare global {
  interface Window {
    applyDevTools: typeof applyDevTools
    editorView?: EditorView
    _node?: { node: PMNode, pos: number }
    _doc?: { [key: string]: any }
    _trs?: Transaction[]
    _plugin?: [Plugin | undefined, unknown]
  }
}

export { applyDevTools, removeDevTools } from './applyDevTools'
export * from './types'
