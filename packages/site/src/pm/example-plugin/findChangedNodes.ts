import { Transaction } from 'prosemirror-state'
import { Node as PMNode, NodeType, Slice } from 'prosemirror-model'
import { Step } from 'prosemirror-transform'

import type { Operation, TrackedNodes } from './types'

export const findAddedOrRemovedNodes = (tr: Transaction, oldDoc: PMNode): TrackedNodes => {
  const nodesMap: Map<PMNode, { pos: number; operation: Operation }> = new Map()
  const typesSet: Set<NodeType> = new Set()
  const steps = (tr.steps || []) as (Step & {
    from: number
    to: number
    slice: Slice
  })[]
  steps.forEach(step => {
    const { to, from, slice } = step
    const sliceSize = slice.size || 0
    const isInsert = from === to
    const isReplace = !isInsert && sliceSize !== 0
    const isDelete = !isInsert && sliceSize === 0
    const operation = isInsert ? 'insert' : isReplace ? 'replace' : 'delete'
    if (isReplace || isDelete) {
      // go through the nodes inside from to
      oldDoc.nodesBetween(from, to, (n, pos) => {
        if (!nodesMap.has(n)) {
          nodesMap.set(n, { pos, operation })
          typesSet.add(n.type)
          return true
        }
      })
    }
    if (isInsert || isReplace) {
      // go through the nodes inside slice
      slice.content.descendants((n, pos) => {
        nodesMap.set(n, { pos, operation })
        typesSet.add(n.type)
      })
    }
  })
  return {
    tr,
    changedNodesMap: nodesMap,
    changedNodesTypesSet: typesSet
  }
}
