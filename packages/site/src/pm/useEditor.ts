import React, { useLayoutEffect, useRef } from 'react'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

import { schema } from 'pm/schema'

export function useEditor(
  editorDOMRef: React.MutableRefObject<HTMLElement | null>,
  cb?: (view: EditorView) => void
) {
  const editorViewRef = useRef<EditorView | null>(null)

  useLayoutEffect(() => {
    const state = EditorState.create({
      schema,
      plugins: exampleSetup({ schema })
    })
    const editorViewDOM = editorDOMRef.current
    if (editorViewDOM) {
      editorViewRef.current = new EditorView(
        { mount: editorViewDOM },
        {
          state
        }
      )
      cb && cb(editorViewRef.current)
    }
    return () => {
      editorViewRef.current?.destroy()
    }
  }, [])
}
