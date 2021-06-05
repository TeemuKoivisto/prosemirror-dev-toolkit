import { Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
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
  const newState = EditorState.create({
    schema: view.state.schema,
    plugins: view.state.plugins,
    doc: view.state.schema.nodeFromJSON(snap.doc)
  })
  view.updateState(newState)
  // const EditorState = this.state.EditorState;
  // const editorView = this.state.view;
  // const editorState = editorView.state;

  // const newState = EditorState.create({
  //   schema: editorState.schema,
  //   plugins: editorState.plugins,
  //   doc: editorState.schema.nodeFromJSON(snapshot.snapshot),
  // });

  // this.setState({
  //   history: [createHistoryEntry(newState)],
  //   state: newState,
  // });

  // editorView.updateState(newState);
}
