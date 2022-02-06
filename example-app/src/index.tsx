import * as React from 'react'
import { render } from 'react-dom'

import { Routes } from './routes'

import './index.css'
import './pm/editor.css'
import './pm/prosemirror-example-setup.css'
import './pm/menu.css'

render(
  <Routes />,
  document.getElementById('root')
)
