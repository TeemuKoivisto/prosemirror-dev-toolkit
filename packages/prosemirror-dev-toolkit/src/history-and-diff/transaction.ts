import type { Transaction } from 'prosemirror-state'

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
