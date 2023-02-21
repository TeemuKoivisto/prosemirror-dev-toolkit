import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'
import { applyDevTools as applyDevToolkit } from 'prosemirror-dev-toolkit'

import { useEditor } from 'pm/useEditor'

export function PlainPMPage() {
  const editorDOMRef = useRef<HTMLDivElement | null>(null)
  const editorViewRef = useEditor(editorDOMRef)
  useMemo(() => {
    if (editorViewRef.current) {
      applyDevToolkit(editorViewRef.current, {
        devToolsExpanded: true
      })
    }
  }, [editorViewRef])

  return (
    <Container>
      <header>
        <h1>
          <a href="https://teemukoivisto.github.io/prosemirror-dev-toolkit">
            prosemirror-dev-toolkit
          </a>
        </h1>
        <p>
          This page mounts a ProseMirror editor without any extra props and it's used in Cypress
          tests
        </p>
      </header>
      <div className="pm-editor plain" ref={editorDOMRef} />
    </Container>
  )
}

const Container = styled.div``
