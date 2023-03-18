import type { EditorView } from 'prosemirror-view'
import DevTools from './components/DevTools.svelte'
import {
  subscribeToDispatchTransaction,
  unsubscribeDispatchTransaction
} from './history-and-diff/subscribeToTransactions'
import { resetHistory } from './stores/stateHistory'

import { createOrFindPlace } from './createOrFindPlace'
import { ProseMirrorDevToolkit } from './ProseMirrorDevToolkit'

import type { Command } from './typings/pm'
import type { DevToolsOpts } from './types'

// Register the fancy web component wrapper
customElements.define('prosemirror-dev-toolkit', ProseMirrorDevToolkit)

// Make the dev tools available globally for testing and other use
if (typeof window !== 'undefined') window.applyDevTools = applyDevTools

let removeCallback: (() => void) | undefined

/**
 * Applies devTools to the given EditorView.
 *
 * Will remove previous devTools instance first, then subscribes to the view's
 * transactions by adding a dispatchTransaction prop. If previous dispatchTransaction
 * prop exists, passes the transaction to it. Otherwise updates the state as normal.
 * Will destroy itself whenever view is destroyed or removeDevTools() is called.
 * @param view
 * @param opts
 */
export function applyDevTools(view: EditorView, opts: DevToolsOpts = {}) {
  const place = createOrFindPlace()

  removeDevTools()

  // Sometimes when applyDevTools is run with hot module reload, it's accidentally executed on already destroyed EditorViews
  if (view.isDestroyed) return

  let comp: DevTools | undefined
  const { disableWebComponent, ...filteredOpts } = opts
  if (disableWebComponent) {
    // Mainly for testing purposes since shadow DOM quite annoyingly hides all of its contents in the test snapshots
    comp = new DevTools({
      target: place,
      props: {
        view,
        ...filteredOpts
      }
    })
  } else {
    const newTools = document.createElement('prosemirror-dev-toolkit')
    newTools.dispatchEvent(
      new CustomEvent('init-dev-toolkit', {
        detail: { view, opts: filteredOpts }
      })
    )
    place.appendChild(newTools)
  }

  if (typeof window !== 'undefined') {
    // Add editorView to the window for testing and debugging purposes
    window.editorView = view
    // Also a helper method to execute commands
    window.pmCmd = (cmd: Command) => {
      const state = view.state
      return cmd(state, view.dispatch, view)
    }
  }

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
    comp?.$destroy()
    const el = place.firstChild
    el && place.removeChild(el)
  }
}

export function removeDevTools() {
  removeCallback && removeCallback()
  removeCallback = undefined
}
