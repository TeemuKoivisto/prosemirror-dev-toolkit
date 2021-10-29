import { EditorView } from 'prosemirror-view'
import type { Node as PMNode } from 'prosemirror-model'
import { getContext as getCtx, setContext as setCtx } from 'svelte'

import { buildColors } from './tabs/structure/colors'

export type Contexts = {
  'editor-view': {
    view: EditorView
  }
  'doc-view': {
    selected: {
      type: string
      start: number
      end: number
    }
    colors: ReturnType<typeof buildColors>
    handleNodeClick: (n: PMNode) => void
  }
}

export const setContext = <K extends keyof Contexts & string>(ctx: K, val: Contexts[K]) =>
  setCtx(ctx, val)

export const getContext = <K extends keyof Contexts & string>(ctx: K) => getCtx(ctx) as Contexts[K]
