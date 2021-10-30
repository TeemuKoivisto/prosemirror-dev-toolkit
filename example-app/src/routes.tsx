import * as React from 'react'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'

import { WrappedRoute } from './components/WrappedRoute'

import { FrontPage } from './pages/FrontPage'
import { DevToolsPage } from './pages/DevToolsPage'
import { PlainPMPage } from './pages/PlainPMPage'
import { NoEditorPage } from './pages/NoEditorPage'

export const Routes = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      <WrappedRoute exact path="/" component={FrontPage}/>
      <WrappedRoute exact path="/dev-tools" component={DevToolsPage}/>
      <WrappedRoute exact path="/plain" component={PlainPMPage}/>
      <WrappedRoute exact path="/no-editor" component={NoEditorPage}/>
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
)
