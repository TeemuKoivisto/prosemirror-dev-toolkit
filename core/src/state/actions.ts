import { get } from 'svelte/store'
import { EditorState, Selection, Transaction } from 'prosemirror-state'
import { diff } from './differ'

import { stateHistory } from './stateHistory.store'
import { createHistoryEntry } from './createHistoryEntry'

import type { HistoryEntry } from './types'

function postprocessValue(value: any) {
  if (value && value._t === 'a') {
    const res: { [key: string]: string | string[] } = {}
    for (let key in value) {
      if (key !== '_t') {
        if (key[0] === '_' && !value[key.substr(1)]) {
          res[key.substr(1)] = value[key]
        } else if (value['_' + key]) {
          res[key] = [value['_' + key][0], value[key][0]]
        } else if (!value['_' + key] && key[0] !== '_') {
          res[key] = value[key]
        }
      }
    }
    return res
  }
  return value
}

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
    const foundIdx = val.findIndex(e => e.id === newEntry.id)
    if (foundIdx !== -1) {
      const withDiff: HistoryEntry = {
        ...val[foundIdx],
        diffPending: false,
        diff: result[0].delta,
        selection: result[1].delta
      }
      // console.log('postprocess', postprocessValue(result[0].delta))
      // console.log('postprocess', postprocessValue(result[1].delta))
      return [...val.slice(0, foundIdx), withDiff, ...val.slice(foundIdx + 1)]
    }
    return val
  })
  console.log(result)
}

export function appendNewHistoryEntry(tr: Transaction, state: EditorState) {
  const values = get(stateHistory)
  const oldEntry = values[values.length - 1]
  const newEntry = createHistoryEntry(tr, state)
  stateHistory.update(val => [newEntry, ...val])
  if (oldEntry) {
    processHistoryEntryDiffs(oldEntry, newEntry)
  }
  // console.log(tr)
  // console.log(get(stateHistory))
  // setTimeout(() => {
  //   console.log(get(stateHistory))
  // }, 0)
}
