import { EditorView } from 'prosemirror-view'
import { EditorState, Transaction } from 'prosemirror-state'
import { get, writable } from 'svelte/store'
import { DOMSerializer } from 'prosemirror-model'
import prettify from 'html-prettify'

// export interface HistoryEvent {
//   time: number // string?
//   state: EditorState
//   contentDiff: any
//   selectionDiff: any
//   selectionContent: any
// }

export interface HistoryEntry {
  id: string
  state: EditorState
  timestamp: number
  diffPending: boolean
  diff?: Object
  selection?: Object
  selectionContent: string
}

export const stateHistory = writable([] as HistoryEntry[])
let active = false

function createHistoryEntry(tr: Transaction, state: EditorState): HistoryEntry {
  const serializer = DOMSerializer.fromSchema(state.schema)
  const selection = state.selection
  const domFragment = serializer.serializeFragment(selection.content().content)

  let selectionContent = []
  if (domFragment) {
    let child = domFragment.firstChild as HTMLElement | null
    while (child) {
      selectionContent.push(child.outerHTML)
      child = child.nextSibling as HTMLElement | null
    }
  }

  return {
    id: Math.random().toString() + Math.random().toString(),
    state: state,
    timestamp: tr.time,
    diffPending: true,
    diff: undefined,
    selection: undefined,
    selectionContent: prettify(selectionContent.join('\n'))
  }
}

export function subscribeToDispatchTransaction(view: EditorView) {
  active = true
  const oldDispatchFn = view.someProp('dispatchTransaction')
  view.setProps({
    dispatchTransaction: (tr: Transaction) => {
      if (oldDispatchFn) oldDispatchFn(tr)
      if (active) {
        stateHistory.update(val => [...val, createHistoryEntry(tr, view.state)])
        // console.log(tr)
        console.log(get(stateHistory))
      }
    }
  })
}

export function unsubscribeDispatchTransaction() {
  active = false
}
