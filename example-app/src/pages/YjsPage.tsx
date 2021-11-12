import React, { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'
import * as Y from 'yjs'
import { ySyncPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import { applyDevTools as applyDevToolkit } from 'prosemirror-dev-toolkit'

import { schema } from 'pm/schema'

export function YjsPage() {
  const editorDOMRef = useRef(null)
  const editorViewRef = useRef<EditorView | null>(null)

  useLayoutEffect(() => {
    const ydoc = new Y.Doc()
    const permanentUserData = new Y.PermanentUserData(ydoc)
    const yXmlFragment = ydoc.getXmlFragment('pm-doc')
    const state = EditorState.create({
      schema,
      plugins: exampleSetup({ schema, history: false }).concat([
        ySyncPlugin(yXmlFragment, {
          permanentUserData: permanentUserData,
          colors: [
            { light: '#ecd44433', dark: '#ecd444' },
            { light: '#ee635233', dark: '#ee6352' },
            { light: '#6eeb8333', dark: '#6eeb83' }
          ]
        }),
        yUndoPlugin(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo
        }),
      ]),
    })
    const editorViewDOM = editorDOMRef.current
    if (editorViewDOM) {
      editorViewRef.current = new EditorView({ mount: editorViewDOM }, {
        state,
      })
      applyDevToolkit(editorViewRef.current, {
        devToolsExpanded: true,
      })
    }
    return () => {
      editorViewRef.current?.destroy()
    }
  }, [])

  return (
    <Container>
      <header>
        <h1><a href="https://teemukoivisto.github.io/prosemirror-dev-toolkit">prosemirror-dev-toolkit</a></h1>
        <p>This editor uses Yjs collaboration which handles the updates to the editor state</p>
      </header>
      <div className="pm-editor" ref={editorDOMRef}/>
    </Container>
  )
}

const Container = styled.div`

`
