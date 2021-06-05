import { EditorView } from 'prosemirror-view'
import { Transaction } from 'prosemirror-state'

import { appendNewHistoryEntry } from './actions'

let active = false

export function subscribeToDispatchTransaction(view: EditorView) {
  active = true
  const oldDispatchFn = view.someProp('dispatchTransaction')
  view.setProps({
    dispatchTransaction: (tr: Transaction) => {
      if (oldDispatchFn) oldDispatchFn(tr)
      if (active) {
        appendNewHistoryEntry(tr, view.state)
      }
    }
  })
}

export function unsubscribeDispatchTransaction() {
  active = false
}
