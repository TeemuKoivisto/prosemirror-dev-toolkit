import type { EditorState, Transaction } from 'prosemirror-state'

export interface HistoryEntry {
  id: string
  state: EditorState
  trs: Transaction[]
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

export interface HistoryListItem {
  id: number
  isGroup: boolean
  topEntry: HistoryEntry
  entries: HistoryEntry[]
  expanded: boolean
}
