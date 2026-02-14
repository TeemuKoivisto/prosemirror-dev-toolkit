import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import ProseMirrorEditor from './App'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement as HTMLElement)

root.render(
  <StrictMode>
    <ProseMirrorEditor />
  </StrictMode>
)
