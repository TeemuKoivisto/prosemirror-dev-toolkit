import type { Fragment as Frag, Node as PMNode } from 'prosemirror-model'
import type { EditorState, Plugin as PMPlugin, Transaction } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

export type Plugin = PMPlugin & { key: string }

export type Fragment = Frag & { content: PMNode[] }

export type Command = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: EditorView
) => boolean | undefined | void
