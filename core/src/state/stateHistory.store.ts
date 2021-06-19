import { derived, writable } from 'svelte/store'

import type { HistoryEntry, HistoryGroup } from './types'

export const stateHistory = writable(new Map<string, HistoryEntry>())
export const shownHistoryGroups = writable([] as HistoryGroup[])
export const latestEntry = derived([stateHistory, shownHistoryGroups], ([entryMap, groups]) =>
  entryMap.get(groups[0]?.topEntryId || '')
)
