import { writable } from 'svelte/store'

import { recurseObjectProperties } from './tree-utils'
import type { ITreeNode, TreeRecursionOpts } from './types'

export function initTreeData(data: any, opts: TreeRecursionOpts) {
  let treeMap = new Map()
  let tree = recurseObjectProperties('root', data, 0, null, treeMap, opts) as ITreeNode
  return {
    treeMapStore: writable<Map<string, ITreeNode | null>>(treeMap),
    treeStore: writable<ITreeNode>(tree)
  }
}
