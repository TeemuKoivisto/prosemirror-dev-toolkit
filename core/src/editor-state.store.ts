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
  timeStr: string
  diffPending: boolean
  diff?: Object
  selection?: Object
  selectionContent: string
}

export const stateHistory = writable([] as HistoryEntry[])
let active = false

function pad(num: number) {
  return ('00' + num).slice(-2)
}

function pad3(num: number) {
  return ('000' + num).slice(-3)
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)
  return [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
    pad3(date.getMilliseconds())
  ].join(':')
}

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
    timeStr: formatTimestamp(tr.time),
    diffPending: true,
    diff: undefined,
    selection: undefined,
    selectionContent: prettify(selectionContent.join('\n')).trim()
  }
}

export function subscribeToDispatchTransaction(view: EditorView) {
  active = true
  const oldDispatchFn = view.someProp('dispatchTransaction')
  view.setProps({
    dispatchTransaction: (tr: Transaction) => {
      if (oldDispatchFn) oldDispatchFn(tr)
      if (active) {
        stateHistory.update(val => [createHistoryEntry(tr, view.state), ...val])
        // console.log(tr)
        console.log(get(stateHistory))
      }
    }
  })
}

export function unsubscribeDispatchTransaction() {
  active = false
}
