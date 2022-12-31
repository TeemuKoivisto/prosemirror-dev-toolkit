import type { EditorState, Transaction } from 'prosemirror-state'

export interface TransactionJSON {
  doc: { [key: string]: any }
  steps: { [key: string]: any }[]
  docs: { [key: string]: any }
  mapping: { [key: string]: any }
  time: number
  curSelection: { [key: string]: any }
  curSelectionFor: number
  storedMarks: null | { [key: string]: any }
  updated: number
  meta: { [key: string]: any } | null
  docChanged: boolean
  isGeneric: boolean
  scrolledIntoView: boolean
  selectionSet: boolean
  storedMarksSet: boolean
}
export interface HistoryEntry {
  id: string
  state: { [key: string]: any }
  trs: TransactionJSON[]
  timestamp: number
  timeStr: string
  contentDiff?: { [key: string]: any }
  selectionDiff?: { [key: string]: any }
  selectionHtml: string
}

export interface HistoryGroup {
  id: number
  isGroup: boolean
  topEntryId: string
  entryIds: string[]
  expanded: boolean
}
