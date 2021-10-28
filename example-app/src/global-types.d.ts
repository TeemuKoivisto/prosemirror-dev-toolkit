declare module 'prosemirror-dev-tools' {
  import type { EditorView } from "prosemirror-view"
  export const applyDevTools: (view: EditorView) => void
}

declare module 'prosemirror-example-setup' {
  import { Plugin } from 'prosemirror-state'
  import type { Schema } from 'prosemirror-model'
  import type { Keymap } from 'prosemirror-commands'

  export interface Options {
    schema: Schema
    mapKeys?: any
    menuBar?: boolean
    floatingMenu?: boolean
    menuContent?: any
    history?: boolean
  }
  export function buildMenuItems(schema: Schema): any
  export function buildKeymap(schema: Schema, mapKeys?: any): Keymap
  export function buildInputRules(schema: Schema): Plugin
  export function exampleSetup(options: Options): Plugin[]
}
