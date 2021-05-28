import * as React from 'react'
import { Route, RouteProps, RouteComponentProps } from 'react-router'
import styled from 'styled-components'

import { NavBar } from './NavBar'

type ReactComponent = React.ComponentClass<any> | React.StatelessComponent<any>

interface IWrappedRoute extends RouteProps {
  component: ReactComponent
}

const renderNoMainContainerWrapper = (Component: ReactComponent) => (props: RouteComponentProps<any>) =>
  <MainWrapper>
    <NavBar {...props}/>
    <Component {...props}/>
  </MainWrapper>

const renderWrapper = (Component: ReactComponent) => (props: RouteComponentProps<any>) =>
  <MainWrapper>
    <NavBar {...props}/>
    <MainContainer>
      <Component {...props}/>
    </MainContainer>
  </MainWrapper>

export const NoMainContainerRoute = ({ component, ...rest } : IWrappedRoute) =>
  <Route {...rest} render={renderNoMainContainerWrapper(component)}/>

export const WrappedRoute = ({ component, ...rest } : IWrappedRoute) =>
  <Route {...rest} render={renderWrapper(component)}/>

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
