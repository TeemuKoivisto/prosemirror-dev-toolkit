import type { EditorState, Transaction } from 'prosemirror-state'

export interface HistoryEntry {
  id: string
  state: EditorState
  tr: Transaction
  timestamp: number
  timeStr: string
  contentDiff?: { [key: string]: any }
  selectionDiff?: { [key: string]: any }
  selectionHtml: string
}

export interface HistoryGroup {
  isGroup: boolean
  topEntryId: string
  entryIds: string[]
  expanded: boolean
}
