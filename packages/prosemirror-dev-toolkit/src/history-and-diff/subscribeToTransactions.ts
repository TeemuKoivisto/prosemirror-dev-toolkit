import type { EditorView } from 'prosemirror-view'
import type { Transaction } from 'prosemirror-state'

import { appendNewHistoryEntry } from '$stores/stateHistory'

let active = false,
  resetDispatch: (() => void) | undefined = undefined

/**
 * Handler for dispatchTransaction that pushes trs to history and monkey patches applyTransaction
 *
 * Incase the editor already has a `dispatchTransaction` prop, oldDispatchFn is called but because
 * that function would also call state.apply we'd run apply multiple times, causing plugins to see
 * transactions often twice. So we monkey patch the `applyTransaction` method and apply some reflection
 * magic to maintain this-context as well as remove the patch if the transaction is somehow different
 * from the original.
 *
 * Why we have to monkey patch the method here and not once globally, is because the method is reset
 * to the original by ProseMirror at times so the function would not get called. Proxying `view.state.applyTransaction`
 * didn't also work.
 *
 * The other option is to use Plugins to store the transactions https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/pull/15
 * which we'll revert to incase this one doesn't cover all the cases.
 * @param view
 * @param oldDispatchFn
 * @returns
 */
const handleDispatch =
  (view: EditorView, oldDispatchFn?: (tr: Transaction) => void) => (tr: Transaction) => {
    console.log('dispatch!', tr)
    const stateBeforeDispatch = view.state
    const applied = view.state.applyTransaction(tr)
    if (oldDispatchFn) {
      const oldFn = view.state.applyTransaction.bind(view.state)
      view.state.applyTransaction = function (trr) {
        if (trr !== tr) {
          view.state.applyTransaction = oldFn
          return Reflect.apply(oldFn, view.state, arguments)
        }
        return applied
      }
      oldDispatchFn(tr)
    } else {
      view.updateState(applied.state)
    }
    // If a plugin filtered a transaction, this would be an empty array
    if (active && applied.transactions.length > 0) {
      appendNewHistoryEntry(applied.transactions, view.state, stateBeforeDispatch)
    }
  }

export function subscribeToDispatchTransaction(view: EditorView) {
  active = true
  // People at times do all kinds of crazy things with EditorView eg extending it with a custom class.
  // This can cause various bugs, for example it can override props setter. Because I don't get points from
  // being right I'll just save them from their own silliness by checking also private _props
  // @ts-ignore
  const oldDispatchFn = (view.props || view._props).dispatchTransaction?.bind(view)
  console.log('subscribe', oldDispatchFn)
  view.setProps({
    dispatchTransaction: handleDispatch(view, oldDispatchFn)
  })
  resetDispatch = () => view.setProps({ dispatchTransaction: oldDispatchFn })
}

export function unsubscribeDispatchTransaction() {
  active = false
  resetDispatch && resetDispatch()
  resetDispatch = undefined
}
