import * as React from 'react'
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'

import { DefaultLayout } from './components/Layout'

import { FrontPage } from './pages/FrontPage'
import { DevToolsPage } from './pages/DevToolsPage'
import { PlainPMPage } from './pages/PlainPMPage'
import { YjsPage } from './pages/YjsPage'
import { NoEditorPage } from './pages/NoEditorPage'

export const Routes = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <RouterRoutes>
      <Route
        path="/"
        element={
          <DefaultLayout>
            <FrontPage />
          </DefaultLayout>
        }
      />
      <Route
        path="/dev-tools"
        element={
          <DefaultLayout>
            <DevToolsPage />
          </DefaultLayout>
        }
      />
      <Route
        path="/plain"
        element={
          <DefaultLayout>
            <PlainPMPage />
          </DefaultLayout>
        }
      />
      <Route
        path="/yjs"
        element={
          <DefaultLayout>
            <YjsPage />
          </DefaultLayout>
        }
      />
      <Route
        path="/no-editor"
        element={
          <DefaultLayout>
            <NoEditorPage />
          </DefaultLayout>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </RouterRoutes>
  </BrowserRouter>
)
