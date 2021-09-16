import { EditorState, Selection, Transaction } from 'prosemirror-state'
import { DOMSerializer } from 'prosemirror-model'
import { prettyPrint } from 'html'

import { diff } from './diff'
import { addPropertiesToTransaction } from './transaction'
import type { HistoryEntry } from '$typings/history'

function buildSelection(selection: Selection) {
  return {
    // @ts-ignore
    type: selection.type,
    empty: selection.empty,
    anchor: selection.anchor,
    head: selection.head,
    from: selection.from,
    to: selection.to
  }
}

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

const regexp = /(&lt;\/?[\w\d\s="']+&gt;)/gim
const highlightHtmlString = (html: string) =>
  html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(regexp, "<span style='color: cadetblue;'>$&</span>")

export function createHistoryEntry(
  tr: Transaction,
  state: EditorState,
  oldEntry?: HistoryEntry
): HistoryEntry {
  const serializer = DOMSerializer.fromSchema(state.schema)
  const selection = state.selection
  const domFragment = serializer.serializeFragment(selection.content().content)

  const selectedElementsAsHtml = []
  if (domFragment) {
    let child = domFragment.firstChild as HTMLElement | null
    while (child) {
      selectedElementsAsHtml.push(child.outerHTML)
      child = child.nextSibling as HTMLElement | null
    }
  }

  const contentDiff = oldEntry ? diff(oldEntry.state.doc.toJSON(), state.doc.toJSON()) : undefined
  const selectionDiff = oldEntry
    ? diff(buildSelection(oldEntry.state.selection), buildSelection(state.selection))
    : undefined

  return {
    id: Math.random().toString() + Math.random().toString(),
    state,
    tr: addPropertiesToTransaction(tr),
    timestamp: tr.time,
    timeStr: formatTimestamp(tr.time),
    contentDiff,
    selectionDiff,
    selectionHtml: highlightHtmlString(
      prettyPrint(selectedElementsAsHtml.join('\n'), {
        max_char: 60,
        indent_size: 2
      })
    )
  }
}
