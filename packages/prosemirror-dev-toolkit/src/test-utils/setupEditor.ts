import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

import { schema } from './schema'

interface Opts {
  exampleSetup: boolean
}

const DEFAULT_OPTIONS = {
  exampleSetup: false
}

export function setupEditor(element: HTMLElement, opts: Opts = DEFAULT_OPTIONS) {
  return new EditorView(
    { mount: element },
    {
      state: EditorState.create({
        schema,
        plugins: opts.exampleSetup ? exampleSetup({ schema }) : []
      })
    }
  )
}
