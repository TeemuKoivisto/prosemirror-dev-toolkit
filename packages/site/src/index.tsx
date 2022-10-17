import * as React from 'react'
import { createRoot } from 'react-dom/client'

import { Routes } from './Routes'

import './index.css'
import './pm/editor.css'
import './pm/prosemirror-example-setup.css'
import './pm/menu.css'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(<Routes />)
