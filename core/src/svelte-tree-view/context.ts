import { setContext } from 'svelte'
import { writable } from 'svelte/store'

import { ITreeNode } from './types'

export const APP_CONTEXT = 'APP_CONTEXT'

export function createContext(data: Object) {
  let treeMap = new Map()
  let tree = recurseObjectProperties('root', data, 0, null, treeMap)
  let treeMapStore = writable(treeMap)
  let treeStore = writable(tree)
  function getRootNode() {
    return tree
  }
  function getNode(id: string) {
    return treeMap.get(id)
  }
  function toggleCollapse(id: string) {
    const node = treeMap.get(id)
    if (node) {
      treeMap.set(node.id, { ...node, collapsed: true })
    } else {
      console.warn(`Attempted to collapse non-existent node: ${id}`)
    }
  }
  setContext(APP_CONTEXT, {
    treeMap,
    tree,
    treeMapStore,
    treeStore,
    getRootNode,
    getNode,
    toggleCollapse
  })
}

function createNode(key: string, value: any, depth: number, parent: ITreeNode | null): ITreeNode {
  return {
    key,
    value,
    id: Math.random().toString() + Math.random().toString(),
    depth: depth + 1,
    collapsed: true,
    path: parent ? [...parent.path, parent.id] : [],
    parent: parent ? parent.id : null,
    children: []
  }
}

function getChildren(value: any): [string, any][] {
  if (Array.isArray(value)) {
    return value.map((v, i) => [i.toString(), v])
  } else if (value instanceof Map) {
    return Array.from(value.entries())
  } else if (typeof value === 'object') {
    return Object.entries(value)
  } else {
    return []
  }
}

function recurseObjectProperties(
  key: string,
  value: any,
  depth: number,
  parent: ITreeNode | null,
  treeMap: Map<string, ITreeNode>
): ITreeNode {
  const node = createNode(key, value, depth, parent)
  treeMap.set(node.id, node)
  node.children = getChildren(value).map(([key, val]) =>
    recurseObjectProperties(key, val, depth + 1, node, treeMap)
  )
  return node
}
