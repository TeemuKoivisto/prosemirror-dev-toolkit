import type { EditorState, Selection, Transaction } from 'prosemirror-state'
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

// Matches any src attribute containing base64 data due to bug in html package and legibility
// https://github.com/TeemuKoivisto/prosemirror-dev-toolkit/issues/81
const srcAttr = /src=[\"|\']data:(.*);base64,(.*)[\"|\']/g

const wrappingCarets = /(&lt;\/?[\w\d\s="']+&gt;)/gim
const highlightHtmlString = (html: string) =>
  html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(wrappingCarets, "<span style='color: cadetblue;'>$&</span>")

export function createHistoryEntry(
  trs: readonly Transaction[],
  state: EditorState,
  stateBeforeDispatch: EditorState,
  oldEntry?: HistoryEntry
): HistoryEntry {
  const serializer = DOMSerializer.fromSchema(state.schema)
  const selection = state.selection
  const domFragment = serializer.serializeFragment(selection.content().content)

  const selectedElementsAsHtml = []
  if (domFragment) {
    let child = domFragment.firstChild as HTMLElement | null
    while (child) {
      selectedElementsAsHtml.push(child.outerHTML.replaceAll(srcAttr, 'src="..."'))
      child = child.nextSibling as HTMLElement | null
    }
  }

  // As described in stateHistory.ts the first entry is a special exception
  const prevState = oldEntry ? oldEntry.state : stateBeforeDispatch
  const contentDiff = diff(prevState.doc.toJSON(), state.doc.toJSON())
  const selectionDiff = diff(buildSelection(prevState.selection), buildSelection(state.selection))

  return {
    id: Math.random().toString() + Math.random().toString(),
    state,
    trs: trs.map(tr => addPropertiesToTransaction(tr)),
    timestamp: trs[0].time,
    timeStr: formatTimestamp(trs[0].time),
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
