import type { EditorView } from 'prosemirror-view'
import type { Transaction } from 'prosemirror-state'

import { appendNewHistoryEntry } from '$stores/stateHistory'

let active = false, oldDispatchFn: (tr: Transaction) => void | undefined

export function subscribeToDispatchTransaction(view: EditorView) : Promise<void> {
  active = true
  // Use timeout to make sure other hooks don't interfere with our patching of dispatchTransaction
  return new Promise((resolve) => {
    setTimeout(() => {
      oldDispatchFn = view.someProp('dispatchTransaction').bind(view)
      view.setProps({
        dispatchTransaction: (tr: Transaction) => {
          const stateBeforeDispatch = view.state
          if (oldDispatchFn) {
            oldDispatchFn(tr)
            // } else {
            //   view.updateState(view.state.apply(tr))
          }
          if (active) {
            appendNewHistoryEntry(tr, view.state, stateBeforeDispatch)
          }
        }
      })
      resolve()
    }, 1)
  })
}

export function unsubscribeDispatchTransaction(view: EditorView) {
  active = false
  view.setProps({ dispatchTransaction: oldDispatchFn })
}
