import { derived, get, writable } from 'svelte/store'
import { EditorState, Transaction } from 'prosemirror-state'

import { createHistoryEntry } from '../history-and-diff/createHistoryEntry'

import { HistoryEntry, HistoryGroup, HistoryListItem } from '$typings/history'

const nextGroupId = writable(0)
const stateHistory = writable<Map<string, HistoryEntry>>(new Map())
const historyGroups = writable<HistoryGroup[]>([])
// const latestEntry = writable<HistoryEntry | undefined>(undefined)
export const metaFilter = writable<string>('')
export const shownHistory = derived([metaFilter, stateHistory], ([filter, history]) =>
  !filter
    ? history
    : new Map(
        Array.from(history.entries()).filter(([_, val]) => val.trs.find(tr => filter in tr['meta']))
      )
)
export const shownHistoryGroups = derived([shownHistory, historyGroups], ([history, groups]) =>
  groups
    .map(g => ({ ...g, entryIds: g.entryIds.filter(id => !history.has(id)) }))
    .filter(g => g.entryIds.length === 0)
    .map(g => ({
      id: g.id,
      isGroup: g.isGroup,
      topEntry: history.get(g.topEntryId) as HistoryEntry,
      entries: g.entryIds.map(id => history.get(id) as HistoryEntry),
      expanded: g.expanded
    }))
)
export const shownLatestEntry = derived([shownHistoryGroups], ([groups]) =>
  groups.length > 0 ? groups[0].topEntry : undefined
)

export function appendNewHistoryEntry(
  trs: readonly Transaction[],
  state: EditorState,
  stateBeforeDispatch: EditorState
) {
  const entryMap = get(stateHistory)
  const prevGroup = get(historyGroups)[0]
  const oldEntry = entryMap.get(prevGroup?.topEntryId || '')
  const id = get(nextGroupId)
  nextGroupId.set(id + 1)
  // In the case of first entry there aren't oldEntries to diff against, therefore we have to use the state
  // before the transaction. We can't use it for the next entries because it will always be one state behind,
  // as the current state is the one _after_ the dispatch. You can observe this in the old dev-tools.
  const newEntry = createHistoryEntry(trs, state, stateBeforeDispatch, oldEntry)

  stateHistory.update(val => new Map(val.set(newEntry.id, newEntry)))
  // latestEntry.set(newEntry)

  // Groups are subsequent transactions where the doc hasn't changed (eg selection was set) OR the diff was equal
  // Haven't seen necessary to differentiate between selection-only vs equal diffs
  const isGroup = !newEntry.contentDiff
  if (prevGroup?.isGroup && isGroup) {
    const newGroup = {
      id,
      isGroup,
      entryIds: [newEntry.id, ...prevGroup.entryIds],
      topEntryId: newEntry.id,
      expanded: prevGroup.expanded
    }
    historyGroups.update(val => [newGroup, ...val.slice(1)])
  } else {
    const newGroup = {
      id,
      isGroup,
      entryIds: [newEntry.id],
      topEntryId: newEntry.id,
      expanded: false
    }
    historyGroups.update(val => [newGroup, ...val])
  }
  console.log(get(shownHistory))
  console.log(get(shownHistoryGroups))
}

export function resetHistory() {
  stateHistory.set(new Map())
  historyGroups.set([])
  // latestEntry.set(undefined)
}

export function toggleGroupExpanded(id: number) {
  historyGroups.update(val => val.map(g => (g.id !== id ? g : { ...g, expanded: !g.expanded })))
}

export function setMetaFilter(val: string) {
  metaFilter.set(val)
}
