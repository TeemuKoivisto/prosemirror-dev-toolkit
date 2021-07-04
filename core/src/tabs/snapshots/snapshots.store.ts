import type { EditorView } from 'prosemirror-view'
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
    const parsed = JSON.parse(persisted)
    snapshots.set(parsed)
  } catch (err) {
    console.error('Corrupted snapshots values in localStorage', err)
  }
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
  snapshots.update(val => [snap, ...val])
}

export function updateSnapshot(snapshot: Snapshot) {
  snapshots.update(val =>
    val.map(s => {
      if (s.timestamp === snapshot.timestamp) {
        return snapshot
      }
      return s
    })
  )
}

export function deleteSnapshot(snapshot: Snapshot) {
  snapshots.update(val => val.filter(s => s.timestamp !== snapshot.timestamp))
}

export function restoreSnapshot(view: EditorView, snap: Snapshot) {
  // Hack to use EditorState.create without explicitly calling EditorState, thus
  // avoiding having to include it as a dependency
  const newState = Object.getPrototypeOf(view.state).constructor.create({
    schema: view.state.schema,
    plugins: view.state.plugins,
    doc: view.state.schema.nodeFromJSON(snap.doc)
  })
  view.updateState(newState)

  // this.setState({
  //   history: [createHistoryEntry(newState)],
  //   state: newState,
  // });
}
