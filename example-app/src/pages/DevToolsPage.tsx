import React from 'react'
import styled from 'styled-components'

import { PageHeader } from '../components/PageHeader'
import { Editor } from '../components/Editor'

export function DevToolsPage() {
  return (
    <Container>
      <PageHeader />
      <Editor useDevTools/>
    </Container>
  )
}

const Container = styled.div`

`
