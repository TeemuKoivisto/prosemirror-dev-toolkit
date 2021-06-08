import { EditorState } from 'prosemirror-state'

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

export interface HistoryGroup {
  isGroup: boolean
  topEntryId: string
  entryIds: string[]
}
