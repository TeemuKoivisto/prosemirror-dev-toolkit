import * as React from 'react'
import styled from 'styled-components'

import { NavBar } from './NavBar'

interface Props {
  children: React.ReactNode
}

export const NoContainerLayout: React.FC<Props> = ({ children }) =>
  <MainWrapper>
    <NavBar />
    { children }
  </MainWrapper>

export const DefaultLayout: React.FC<Props> = ({ children }) =>
  <MainWrapper>
    <NavBar />
    <MainContainer>
      { children }
    </MainContainer>
  </MainWrapper>

const MainWrapper = styled.div`
  min-height: 100vh;
`
const MainContainer = styled.main`
  margin: 40px auto 0 auto;
  max-width: 680px;
  padding-bottom: 20px;
  @media only screen and (max-width: 720px) {
    margin: 40px 20px 0 20px;
    padding-bottom: 20px;
  }
`
