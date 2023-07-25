import { removeDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import type { SWMessageMap } from '../types'

import { mounted, state, injectActions } from './state'
import { shouldRerun } from './utils'

declare global {
  interface Element {
    pmViewDesc?: {
      updateChildren: (view: EditorView, pos: number) => void
      selectNode: () => void
      deselectNode: () => void
    }
  }
}

async function handleMessages<K extends keyof SWMessageMap>(event: MessageEvent<SWMessageMap[K]>) {
  if (
    typeof event.data !== 'object' ||
    !('source' in event.data) ||
    event.data.source !== 'pm-dev-tools'
  ) {
    return
  }
  if (event.data.origin !== 'sw') {
    return
  }
  // console.log('RECEIVED IN INJECT', event.data)
  const msg = event.data
  switch (msg.type) {
    case 'inject-state':
      if ((!mounted && !msg.data.disabled) || shouldRerun(state, msg.data)) {
        injectActions.findInstances()
        injectActions.setMounted(true)
      } else if (mounted && msg.data.disabled) {
        removeDevTools()
        injectActions.setMounted(false)
      }
      injectActions.setState(msg.data)
      break
    case 'rerun-inject':
      removeDevTools()
      injectActions.findInstances()
      break
  }
}

window.addEventListener('message', handleMessages, false)

export {}
