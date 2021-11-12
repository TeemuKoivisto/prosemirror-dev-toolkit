import React, { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { applyDevTools as applyDevToolkit } from 'prosemirror-dev-toolkit'

import { schema } from 'pm/schema'

export function PlainPMPage() {
  const editorDOMRef = useRef(null)
  const editorViewRef = useRef<EditorView | null>(null)

  useLayoutEffect(() => {
    const state = EditorState.create({
      schema,
      plugins: exampleSetup({ schema }),
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
        <p>This page mounts a ProseMirror editor without any extra props and it's used in Cypress tests</p>
      </header>
      <div className="pm-editor" ref={editorDOMRef}/>
    </Container>
  )
}

const Container = styled.div`

`
