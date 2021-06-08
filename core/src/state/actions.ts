import { get } from 'svelte/store'
import { EditorState, Selection, Transaction } from 'prosemirror-state'
import { diff } from './differ'

import { stateHistory, shownHistoryGroups } from './stateHistory.store'
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
    const foundEntry = val.get(newEntry.id)
    if (foundEntry) {
      const withDiff: HistoryEntry = {
        ...foundEntry,
        diffPending: false,
        diff: result[0].delta,
        selection: result[1].delta
      }
      // console.log('postprocess', postprocessValue(result[0].delta))
      // console.log('postprocess', postprocessValue(result[1].delta))
      return new Map(val.set(foundEntry.id, withDiff))
    }
    return val
  })
  console.log(result)
}

export function appendNewHistoryEntry(tr: Transaction, state: EditorState) {
  const entryMap = get(stateHistory)
  const prevGroup = get(shownHistoryGroups)[0]
  const oldEntry = entryMap.get(prevGroup?.topEntryId || '')
  const newEntry = createHistoryEntry(tr, state)

  stateHistory.update(val => new Map(val.set(newEntry.id, newEntry)))

  const isGroup = !tr.docChanged
  if (prevGroup?.isGroup && isGroup) {
    const newGroup = {
      isGroup,
      entryIds: [newEntry.id, ...prevGroup.entryIds],
      topEntryId: newEntry.id
    }
    shownHistoryGroups.update(val => [newGroup, ...val.slice(1)])
  } else {
    const newGroup = {
      isGroup,
      entryIds: [newEntry.id],
      topEntryId: newEntry.id
    }
    shownHistoryGroups.update(val => [newGroup, ...val])
  }

  if (oldEntry) {
    processHistoryEntryDiffs(oldEntry, newEntry)
  }
}
