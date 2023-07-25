import React, { useRef } from 'react'
import styled from 'styled-components'

import { useEditor } from 'pm/useEditor'

export function IFramePage() {
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
        <p>
          This page contains ProseMirror instances, two of them inside iframe to debug the Chrome
          extension.
        </p>
      </header>
      {/* <iframe src="http://localhost:3300/no-editor"></iframe> */}
      <iframe className="m-top" src="https://prosemirror.net"></iframe>
      <div className="pm-editor plain m-top" ref={editorDOMRef} />
    </Container>
  )
}

const Container = styled.div`
  iframe {
    height: 100vh;
    width: 100%;
  }
  .m-top {
    margin-top: 1rem;
  }
`
