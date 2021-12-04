import type { EditorView } from 'prosemirror-view'
import type { Transaction } from 'prosemirror-state'

import { appendNewHistoryEntry } from '$stores/stateHistory'

let active = false,
  resetDispatch: (() => void) | undefined = undefined

export function subscribeToDispatchTransaction(view: EditorView) {
  active = true
  const oldDispatchFn = view.someProp('dispatchTransaction')?.bind(view)
  view.setProps({
    dispatchTransaction(tr: Transaction) {
      const stateBeforeDispatch = view.state
      const { state, transactions } = this.state.applyTransaction(tr)
      if (oldDispatchFn) {
        oldDispatchFn(tr)
      } else {
        this.updateState(state)
      }
      if (active) {
        appendNewHistoryEntry(transactions, view.state, stateBeforeDispatch)
      }
    }
  })
  resetDispatch = () => view.setProps({ dispatchTransaction: oldDispatchFn })
}

export function unsubscribeDispatchTransaction() {
  active = false
  resetDispatch && resetDispatch()
  resetDispatch = undefined
}
