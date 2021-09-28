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
      type: string,
      start: number,
      end: number
    }
    colors: ReturnType<typeof buildColors>
    handleNodeClick: (n: PMNode) => void
  }
}

export function setContext<K extends keyof Contexts>(
  ctx: K,
  val: Contexts[K]
) {
  return setCtx(ctx, val)
}

export function getContext<K extends keyof Contexts>(ctx: K) {
  return getCtx(ctx) as Contexts[K]
}
