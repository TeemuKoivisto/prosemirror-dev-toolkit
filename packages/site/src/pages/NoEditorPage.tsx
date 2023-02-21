import React, { useRef } from 'react'
import styled from 'styled-components'

import { useEditor } from 'pm/useEditor'

export function NoEditorPage() {
  const editorDOMRef = useRef<HTMLDivElement | null>(null)
  useEditor(editorDOMRef)
  return (
    <Container>
      <header>
        <h1>
          <a href="https://teemukoivisto.github.io/prosemirror-dev-toolkit">
            prosemirror-dev-toolkit
          </a>
        </h1>
        <p>This page has no editor to test whether devTools unmounts properly.</p>
      </header>
      <div className="pm-editor plain" ref={editorDOMRef} />
    </Container>
  )
}

const Container = styled.div``
