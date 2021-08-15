import { writable } from 'svelte/store'

import type { HistoryEntry, HistoryGroup } from './types'

export const stateHistory = writable(new Map<string, HistoryEntry>())
export const shownHistoryGroups = writable([] as HistoryGroup[])
export const latestEntry = writable<HistoryEntry | undefined>(undefined)
