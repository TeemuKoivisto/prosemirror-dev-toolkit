import type { EditorView } from 'prosemirror-view'
import type { Transaction } from 'prosemirror-state'

import { appendNewHistoryEntry } from './actions'

let active = false

export function subscribeToDispatchTransaction(view: EditorView) {
  active = true
  const oldDispatchFn = view.someProp('dispatchTransaction')
  // Use timeout to make sure other hooks don't interfere with our patching of dispatchTransaction
  setTimeout(() => {
    view.setProps({
      dispatchTransaction: (tr: Transaction) => {
        if (oldDispatchFn) {
          oldDispatchFn(tr)
          // } else {
          //   view.updateState(view.state.apply(tr))
        }
        if (active) {
          appendNewHistoryEntry(tr, view.state)
        }
      }
    })
  }, 1)
}

export function unsubscribeDispatchTransaction() {
  active = false
}
