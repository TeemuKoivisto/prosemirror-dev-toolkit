import type { Transaction } from "prosemirror-state"
import type { EditorView } from "prosemirror-view"
import {
  initSubscriptionPlugin,
  insertSubscriptionPlugin,
  removeSubscriptionPlugin
} from "./SubscriptionPlugin"

import { appendNewHistoryEntry } from "$stores/stateHistory"

let active = false,
  resetDispatch: (() => void) | undefined = undefined

export function subscribeToDispatchTransaction(view: EditorView) {
  active = true
  const oldDispatchFn = view.someProp("dispatchTransaction")?.bind(view)
  const [plugin, pluginState] = initSubscriptionPlugin()

  view.setProps({
    dispatchTransaction: (tr: Transaction) => {
      insertSubscriptionPlugin(view.state, plugin)

      const stateBeforeDispatch = view.state

      if (oldDispatchFn) {
        oldDispatchFn(tr)
      } else {
        view.updateState(view.state.apply(tr))
      }

      const transactions = pluginState.clear()
      removeSubscriptionPlugin(view.state)

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
