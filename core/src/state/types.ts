import { EditorState } from 'prosemirror-state'

export interface HistoryEntry {
  id: string
  state: EditorState
  timestamp: number
  timeStr: string
  diffPending: boolean
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
