import { snapshots } from '$stores/snapshots'
import type { EditorView } from 'prosemirror-view'
import DevTools from './components/DevTools.svelte'
import {
  subscribeToDispatchTransaction,
  unsubscribeDispatchTransaction
} from './history-and-diff/subscribeToTransactions'
import { resetHistory, stateHistory, shownHistoryGroups } from './stores/stateHistory'

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
  let removeSubcriptions: undefined | (() => void)
  if (opts.remoteSource) {
    const cb1 = snapshots.subscribe(val => {
      console.log('post message')
      window.postMessage({ source: 'pm-dev-tools', origin: 'dev-tools', type: 'snapshots', data: val })
    })
    const cb2 = stateHistory.subscribe(val => {
      const json = Array.from(val.entries()).map(([id, e]) => [id, {
        ...e,
        // state: e.state.toJSON(),
      }])
      window.postMessage({ source: 'pm-dev-tools', origin: 'dev-tools', type: 'history', data: json })
    })
    const cb3 = shownHistoryGroups.subscribe(val => {
      window.postMessage({ source: 'pm-dev-tools', origin: 'dev-tools', type: 'history-groups', data: val })
    })
    removeSubcriptions = () => {
      cb1()
      cb2()
      cb3()
    }
  }
  
  removeCallback = () => {
    removeSubcriptions && removeSubcriptions()
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
