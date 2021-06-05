import { writable } from 'svelte/store'

export interface Snapshot {
  name: string
  timestamp: number
  doc: { [key: string]: any }
}

const SNAPSHOTS_KEY = '__prosemirror-dev-toolkit__snapshots'

export const snapshots = writable<Snapshot[]>([])

const persisted = typeof window !== 'undefined' ? localStorage.getItem(SNAPSHOTS_KEY) : null
if (persisted && persisted.length > 0) {
  try {
    let parsed = JSON.parse(persisted)
    snapshots.set(parsed)
  } catch (err) {}
}

snapshots.subscribe(val => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(val))
  }
})

export function saveSnapshot(snapshotName: string, doc: { [key: string]: any }) {
  const snap: Snapshot = {
    name: snapshotName,
    timestamp: Date.now(),
    doc
  }
  snapshots.update(val => [...val, snap])
}
