declare module 'prosemirror-dev-tools' {
  import type { EditorView } from "prosemirror-view"
  export const applyDevTools: (view: EditorView) => void
}

declare module 'prosemirror-example-setup' {
  import { Schema, Plugin } from 'prosemirror-state'
  export const exampleSetup: (opts: { schema: Schema }) => Plugin[]
}