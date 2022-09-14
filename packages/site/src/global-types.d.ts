declare module 'prosemirror-dev-tools' {
  import type { EditorView } from 'prosemirror-view'
  export const applyDevTools: (view: EditorView) => void
}
