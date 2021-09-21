import type { EditorView } from 'prosemirror-view'
import DevTools from './DevTools.svelte'
import {
  subscribeToDispatchTransaction,
  unsubscribeDispatchTransaction
} from './history-and-diff/subscribeToTransactions'

import { DevToolsOpts } from './types'

declare global {
  interface Window { 
    applyDevTools: any
    editorView: any
    _node: any
    _tr: any
    _plugin: any
  }
}

const DEVTOOLS_CLASS_NAME = '__prosemirror-dev-toolkit__'

// Make the dev tools available globally for some scripting shenanigans
window.applyDevTools = applyDevTools

function createOrFindPlace() {
  let place: HTMLElement | null = document.querySelector(`.${DEVTOOLS_CLASS_NAME}`)

  if (!place) {
    place = document.createElement('div')
    place.className = DEVTOOLS_CLASS_NAME
    document.body.appendChild(place)
  }

  return place
}

let removeCallback: (() => void) | undefined

export function applyDevTools(view: EditorView, opts: DevToolsOpts = {}) {
  const place = createOrFindPlace()
  const comp = new DevTools({
    target: place,
    props: {
      view,
      ...opts
    }
  })
  // Make the editor view available since it might be handy for quick debugging
  window.editorView = view

  // Bind the component's life-cycle to the editorView to automatically unmount the devTools
  const oldDestroyFn = view.destroy.bind(view)
  view.destroy = () => {
    oldDestroyFn()
    removeCallback && removeCallback()
  }

  subscribeToDispatchTransaction(view)
  removeCallback = () => {
    unsubscribeDispatchTransaction()
    comp.$destroy()
  }
}

export function removeDevTools() {
  removeCallback && removeCallback()
}
