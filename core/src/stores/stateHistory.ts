import { get, writable } from 'svelte/store'
import { EditorState, Transaction } from 'prosemirror-state'

import { createHistoryEntry } from '../history-and-diff/createHistoryEntry'

import type { HistoryEntry, HistoryGroup } from '$typings/history'

export const stateHistory = writable<Map<string, HistoryEntry>>(new Map())
export const shownHistoryGroups = writable<HistoryGroup[]>([])
export const latestEntry = writable<HistoryEntry | undefined>(undefined)

export function appendNewHistoryEntry(tr: Transaction, state: EditorState, stateBeforeDispatch: EditorState) {
  const entryMap = get(stateHistory)
  const prevGroup = get(shownHistoryGroups)[0]
  const oldEntry = entryMap.get(prevGroup?.topEntryId || '')
  // In the case of first entry there aren't oldEntries to diff against, therefore we have to use the state
  // before the transaction. We can't use it for the next entries because it will always be one state behind,
  // as the current state is the one _after_ the dispatch. You can observe this in the old dev-tools.
  const newEntry = createHistoryEntry(tr, state, stateBeforeDispatch, oldEntry)

  stateHistory.update(val => new Map(val.set(newEntry.id, newEntry)))
  latestEntry.set(newEntry)

  // Groups are subsequent transactions where the doc hasn't changed (eg selection was set) OR the diff was equal
  // Haven't seen necessary to differentiate between selection-only vs equal diffs
  const isGroup = !newEntry.contentDiff
  if (prevGroup?.isGroup && isGroup) {
    const newGroup = {
      isGroup,
      entryIds: [newEntry.id, ...prevGroup.entryIds],
      topEntryId: newEntry.id,
      expanded: prevGroup.expanded
    }
    shownHistoryGroups.update(val => [newGroup, ...val.slice(1)])
  } else {
    const newGroup = {
      isGroup,
      entryIds: [newEntry.id],
      topEntryId: newEntry.id,
      expanded: false
    }
    shownHistoryGroups.update(val => [newGroup, ...val])
  }
}

export function resetHistory() {
  stateHistory.set(new Map())
  shownHistoryGroups.set([])
  latestEntry.set(undefined)
}
