import { EditorState, Selection, Transaction } from 'prosemirror-state'
import { DOMSerializer } from 'prosemirror-model'
import prettify from 'html-prettify'

import type { HistoryEntry } from './types'

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

export function createHistoryEntry(tr: Transaction, state: EditorState): HistoryEntry {
  const serializer = DOMSerializer.fromSchema(state.schema)
  const selection = state.selection
  const domFragment = serializer.serializeFragment(selection.content().content)

  let selectedElementsAsHtml = []
  if (domFragment) {
    let child = domFragment.firstChild as HTMLElement | null
    while (child) {
      selectedElementsAsHtml.push(child.outerHTML)
      child = child.nextSibling as HTMLElement | null
    }
  }

  return {
    id: Math.random().toString() + Math.random().toString(),
    state: state,
    timestamp: tr.time,
    timeStr: formatTimestamp(tr.time),
    diffPending: true,
    contentDiff: undefined,
    selectionDiff: undefined,
    selectionHtml: prettify(selectedElementsAsHtml.join('\n')).trim()
  }
}
