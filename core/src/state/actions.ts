import { get } from 'svelte/store'
import { EditorState, Transaction } from 'prosemirror-state'

import { stateHistory, shownHistoryGroups } from './stateHistory.store'
import { createHistoryEntry } from './createHistoryEntry'

export function appendNewHistoryEntry(tr: Transaction, state: EditorState) {
  const entryMap = get(stateHistory)
  const prevGroup = get(shownHistoryGroups)[0]
  const oldEntry = entryMap.get(prevGroup?.topEntryId || '')
  const newEntry = createHistoryEntry(tr, state, oldEntry)

  stateHistory.update(val => new Map(val.set(newEntry.id, newEntry)))

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
}
