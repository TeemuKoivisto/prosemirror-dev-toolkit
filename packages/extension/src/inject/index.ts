import { removeDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import type { SWMessageMap } from '../types'

import { mounted, state, injectActions } from './store'
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
      // Check shouldRerun first before over-writing the state
      const rerun = shouldRerun(state, msg.data)
      injectActions.setState(msg.data)
      if ((!mounted && !msg.data.disabled) || rerun) {
        // If toolkit wasn't mounted and it's not disabled -> run
        // Otherwise check whether the toolkit is still enabled and an option has changed
        injectActions.findInstances()
        injectActions.setMounted(true)
      } else if (mounted && msg.data.disabled) {
        // If toolkit is mounted and it is being disabled -> remove it
        removeDevTools()
        injectActions.setMounted(false)
      }
      break
    case 'rerun-inject':
      removeDevTools()
      injectActions.setMounted(false)
      injectActions.findInstances()
      break
  }
}

window.addEventListener('message', handleMessages)

export {}
