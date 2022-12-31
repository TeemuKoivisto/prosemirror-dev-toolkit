import type { Transaction } from 'prosemirror-state'
import type { TransactionJSON } from '$typings/history'

const addedProperties = [
  'docChanged',
  'isGeneric',
  'scrolledIntoView',
  'selectionSet',
  'storedMarksSet'
]

export function addPropertiesToTransaction(tr: Transaction) {
  return Object.keys(tr)
    .concat(addedProperties)
    .reduce((acc, key) => {
      // @ts-ignore
      acc[key] = tr[key]
      return acc
    }, {} as Transaction)
}

export function parseTransctionIntoJSON(tr: Transaction): TransactionJSON {
  return {
    doc: tr.doc.toJSON(),
    steps: tr.steps.map(s => s.toJSON()),
    docs: tr.docs.map(d => d.toJSON()),
    mapping: tr.mapping,
    // mapping: {
    //   from: tr.mapping.from,
    //   to: tr.mapping.to,
    //   maps: tr.mapping.maps.map(s => s)
    // },
    time: tr.time,
    // @ts-ignore
    curSelection: tr.curSelection.toJSON(),
    // @ts-ignore
    curSelectionFor: tr.curSelectionFor,
    storedMarks: tr.storedMarks?.map(m => m.toJSON()) || null,
    // @ts-ignore
    updated: tr.updated,
    // @ts-ignore
    meta: tr.meta,
    docChanged: tr.docChanged,
    isGeneric: tr.isGeneric,
    scrolledIntoView: tr.scrolledIntoView,
    selectionSet: tr.selectionSet,
    storedMarksSet: tr.storedMarksSet,
  }
}