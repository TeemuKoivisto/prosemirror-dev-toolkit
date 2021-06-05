import { writable } from 'svelte/store'

import type { HistoryEntry } from './types'

export const stateHistory = writable([] as HistoryEntry[])
