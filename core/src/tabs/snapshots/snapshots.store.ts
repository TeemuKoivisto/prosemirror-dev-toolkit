import { EditorState } from 'prosemirror-state'
import { writable } from 'svelte/store'

export interface Snapshot {
  time: number // string?
  state: EditorState
}

export const snapshots = writable([])

export function saveSnapshot(tr: any) {}
