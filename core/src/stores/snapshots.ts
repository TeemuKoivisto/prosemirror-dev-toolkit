import type { EditorView } from 'prosemirror-view'
import type { EditorState } from 'prosemirror-state'
import { get, writable } from 'svelte/store'

import type { Snapshot } from '$typings/snapshots'
import { Schema } from 'prosemirror-model'

const SNAPSHOTS_KEY = '__prosemirror-dev-toolkit__snapshots'

export const snapshots = writable<Snapshot[]>([])
export const selectedSnapshot = writable<Snapshot | undefined>()
export const previousEditorState = writable<EditorState | undefined>()

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

function setEditorDoc(view: EditorView, doc: { [key: string]: any }) {
  // Hack to use EditorState.create without explicitly calling EditorState, thus
  // avoiding having to include it as a dependency
  const newState = Object.getPrototypeOf(view.state).constructor.create({
    schema: view.state.schema,
    plugins: view.state.plugins,
    doc: view.state.schema.nodeFromJSON(doc)
  })
  view.updateState(newState)
}

export function saveSnapshot(snapshotName: string, doc: { [key: string]: any }) {
  const snap: Snapshot = {
    name: snapshotName,
    timestamp: Date.now(),
    doc
  }
  snapshots.update(val => [snap, ...val])
}

export function importSnapshot(
  snapshotName: string,
  json: { [key: string]: unknown },
  schema: Schema
) {
  const doc = schema.nodeFromJSON(json)
  const snap: Snapshot = {
    name: snapshotName,
    timestamp: Date.now(),
    doc: doc.toJSON()
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

export function toggleViewSnapshot(view: EditorView, snap?: Snapshot) {
  if (snap) {
    const prevState = get(previousEditorState)
    if (!prevState) previousEditorState.set(view.state)
    setEditorDoc(view, snap.doc)
  } else {
    const prevState = get(previousEditorState)
    if (!prevState) {
      console.error('No previous state to restore!')
    } else {
      view.updateState(prevState)
    }
    previousEditorState.set(undefined)
  }
  selectedSnapshot.set(snap)
}

export function restoreSnapshot(view: EditorView, snap: Snapshot) {
  setEditorDoc(view, snap.doc)
  previousEditorState.set(undefined)
  selectedSnapshot.set(undefined)
}

export function exportSnapshot(snapshot: Snapshot) {
  const a = document.createElement('a')
  const file = new Blob([JSON.stringify(snapshot.doc)], { type: 'application/json' })
  a.href = URL.createObjectURL(file)
  a.download = `${snapshot.name}.json`
  a.click()
}

export function deleteSnapshot(snapshot: Snapshot) {
  snapshots.update(val => val.filter(s => s.timestamp !== snapshot.timestamp))
  const selected = get(selectedSnapshot)
  if (selected?.timestamp === snapshot.timestamp) {
    selectedSnapshot.set(undefined)
  }
}
