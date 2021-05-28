import { EditorView } from 'prosemirror-view'
import { setContext } from 'svelte'

export const APP_CONTEXT = 'APP_CONTEXT'

export function createContext(view: EditorView) {
  setContext(APP_CONTEXT, {
    view
  })
}
