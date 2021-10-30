import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { RouteComponentProps } from 'react-router'

interface IProps extends RouteComponentProps<{}> {
  className?: string
}

export function NavBar(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <Nav>
        <Link to="/" exact activeClassName="current">Front page</Link>
        <Link to="/dev-tools" exact activeClassName="current">Dev tools</Link>
        <Link to="/plain" exact activeClassName="current">Plain</Link>
        <Link to="/no-editor" exact activeClassName="current">No editor</Link>
      </Nav>
    </Container>
  )
}

const Container = styled.div`
  background: var(--color-primary);
  box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);
  padding: 1rem;
`
const Nav = styled.nav`
  align-items: center;
  color: #fff;
  display: flex;
`
const Link = styled(NavLink)`
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: 0.2s hover;
  &:hover {
    text-decoration: underline;
  }
  &.current {
    font-weight: 600;
  }
`
