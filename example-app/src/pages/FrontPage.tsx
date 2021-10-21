import React from 'react'
import styled from 'styled-components'

import { Editor } from '../components/Editor'

export function FrontPage() {
  return (
    <Container>
      <header>
        <h1><a href="https://github.com/TeemuKoivisto/prosemirror-dev-toolkit">prosemirror-dev-toolkit</a></h1>
        <p>Github repo</p>
        <p>An example React app with ProseMirror editor that uses dev-toolkit.</p>
      </header>
      <Editor/>
    </Container>
  )
}

const Container = styled.div`

`
