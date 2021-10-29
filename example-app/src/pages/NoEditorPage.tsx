import React from 'react'
import styled from 'styled-components'

export function NoEditorPage() {
  return (
    <Container>
      <header>
        <h1><a href="https://github.com/TeemuKoivisto/prosemirror-dev-toolkit">prosemirror-dev-toolkit</a></h1>
        <p>Github repo</p>
        <p>This page has no editor to test whether devTools unmounts properly.</p>
      </header>
    </Container>
  )
}

const Container = styled.div`

`
