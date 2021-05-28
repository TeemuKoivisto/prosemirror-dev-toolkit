import * as React from 'react'
import styled from 'styled-components'

interface IProps {
  className?: string
}

export function PageHeader(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <header>
        <h1>Example PM editor with prosemirror-dev-toolkit</h1>
      </header>
    </Container>
  )
}

const Container = styled.div`
`
