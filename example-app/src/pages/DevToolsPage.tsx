import React from 'react'
import styled from 'styled-components'

import { PageHeader } from '../components/PageHeader'
import { Editor } from '../components/Editor'

export function DevToolsPage() {
  return (
    <Container>
      <header>
        <h1><a href="https://github.com/d4rkr00t/prosemirror-dev-tools">Original prosemirror-dev-tools</a></h1>
        <p><a href="https://github.com/d4rkr00t/prosemirror-dev-tools">Github repo</a></p>
      </header>
      <Editor useDevTools/>
    </Container>
  )
}

const Container = styled.div`

`
