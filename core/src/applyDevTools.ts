import type { EditorView } from 'prosemirror-view'
import DevTools from './components/DevTools.svelte'
import {
  subscribeToDispatchTransaction,
  unsubscribeDispatchTransaction
} from './history-and-diff/subscribeToTransactions'
import { resetHistory } from './stores/stateHistory'

import { DevToolsOpts } from './types'

const DEVTOOLS_CSS_CLASS = '__prosemirror-dev-toolkit__'

// Make the dev tools available globally for testing and other use
if (typeof window !== 'undefined') window.applyDevTools = applyDevTools

function createOrFindPlace() {
  let place: HTMLElement | null = document.querySelector(`.${DEVTOOLS_CSS_CLASS}`)

  if (!place) {
    place = document.createElement('div')
    place.className = DEVTOOLS_CSS_CLASS
    document.body.appendChild(place)
  }

  return place
}

let removeCallback: (() => void) | undefined

export function applyDevTools(view: EditorView, opts: DevToolsOpts = {}) {
  const place = createOrFindPlace()

  removeDevTools()

  const comp = new DevTools({
    target: place,
    props: {
      view,
      ...opts
    }
  })
  // Also add view to the window for testing and other debugging
  if (typeof window !== 'undefined') window.editorView = view

  // Bind the component's life-cycle to the editorView to automatically unmount the devTools
  const oldDestroyFn = view.destroy.bind(view)
  view.destroy = () => {
    // DevTools must always be removed before view as the resetDispatch requires view to be still present
    removeDevTools()
    oldDestroyFn()
  }

  subscribeToDispatchTransaction(view)

  removeCallback = () => {
    resetHistory()
    unsubscribeDispatchTransaction()
    // TODO add test to check no "Component already destroyed" warnings appear
    comp.$destroy()
  }
}

export function removeDevTools() {
  removeCallback && removeCallback()
  removeCallback = undefined
}
