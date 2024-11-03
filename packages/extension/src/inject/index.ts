import { removeDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import { mounted, state, injectActions } from './store'
import { shouldRerun } from './utils'

import type { SWMessageMap } from '../types'

declare global {
  interface Element {
    pmViewDesc?: globalThis.Node['pmViewDesc'] & {
      updateChildren: (view: EditorView, pos: number) => void
      selectNode: () => void
      deselectNode: () => void
    }
  }
}

const isSwMsg = (msg: any): msg is SWMessageMap[keyof SWMessageMap] =>
  msg &&
  typeof msg === 'object' &&
  !Array.isArray(msg) &&
  'source' in msg &&
  msg.source === 'pm-dev-tools' &&
  msg.origin === 'sw'

export const onmessage = (event: MessageEvent<unknown>) => {
  const { data: msg } = event
  if (!isSwMsg(msg)) return
  switch (msg.type) {
    case 'run-inject':
      // Check shouldRerun first before over-writing the state
      const rerun = shouldRerun(state, msg.data)
      injectActions.setState(msg.data)
      if ((!mounted && !msg.data.global.disabled) || rerun) {
        // If toolkit wasn't mounted and it's not disabled -> run
        // Otherwise check whether the toolkit is still enabled and an option has changed
        injectActions.findInstances()
        injectActions.setMounted(true)
      } else if (msg.data.global.disabled) {
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
    case 'abort-inject':
      injectActions.abort()
      break
  }
}

window.addEventListener('message', onmessage)

export {}
