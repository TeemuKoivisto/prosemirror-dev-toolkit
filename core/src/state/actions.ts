import { get } from 'svelte/store'
import { EditorState, Selection, Transaction } from 'prosemirror-state'
import { diff } from './differ'

import { stateHistory, shownHistoryGroups } from './stateHistory.store'
import { createHistoryEntry } from './createHistoryEntry'

import type { HistoryEntry } from './types'

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

async function processHistoryEntryDiffs(oldEntry: HistoryEntry, newEntry: HistoryEntry) {
  const result = await Promise.all([
    diff(newEntry.id, oldEntry.state.doc.toJSON(), newEntry.state.doc.toJSON()),
    diff(
      newEntry.id,
      buildSelection(oldEntry.state.selection),
      buildSelection(newEntry.state.selection)
    )
  ])
  stateHistory.update(val => {
    const foundEntry = val.get(newEntry.id)
    if (foundEntry) {
      const withDiff: HistoryEntry = {
        ...foundEntry,
        diffPending: false,
        contentDiff: result[0].delta,
        selectionDiff: result[1].delta
      }
      return new Map(val.set(foundEntry.id, withDiff))
    }
    return val
  })
}

export function appendNewHistoryEntry(tr: Transaction, state: EditorState) {
  const entryMap = get(stateHistory)
  const prevGroup = get(shownHistoryGroups)[0]
  const oldEntry = entryMap.get(prevGroup?.topEntryId || '')
  const newEntry = createHistoryEntry(tr, state)

  stateHistory.update(val => new Map(val.set(newEntry.id, newEntry)))

  const isGroup = !tr.docChanged
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

  if (oldEntry) {
    processHistoryEntryDiffs(oldEntry, newEntry)
  }
}
