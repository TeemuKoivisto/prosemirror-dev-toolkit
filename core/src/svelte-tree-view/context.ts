import { setContext } from 'svelte'
import { get, writable } from 'svelte/store'
import { createNode } from './tree-utils'

import { ITreeNode, TreeViewProps } from './types'

export const createContext = (props: TreeViewProps) => {
  const treeMapStore = writable<Map<string, ITreeNode | null>>(new Map())
  const treeStore = writable<ITreeNode>(createNode(0, 'root', [], 0, null))
  const propsStore = writable<TreeViewProps>(props)
  const rootElementStore = writable<HTMLElement | null>(null)

  function getNode(id: string) {
    return get(treeMapStore).get(id)
  }
  function toggleCollapse(id: string) {
    const node = getNode(id)
    if (node) {
      treeMapStore.update(m => new Map(m.set(node.id, { ...node, collapsed: !node.collapsed })))
    } else {
      console.warn(`Attempted to collapse non-existent node: ${id}`)
    }
  }
  function expandAllNodesToNode(id: string) {
    function recurseNodeUpwards(updated: Map<string, ITreeNode | null>, node?: ITreeNode | null) {
      if (!node) return
      updated.set(node.id, { ...node, collapsed: false })
      if (node.parentId) {
        recurseNodeUpwards(updated, updated.get(node.parentId))
      }
    }
    const updated = new Map<string, ITreeNode | null>(get(treeMapStore))
    recurseNodeUpwards(updated, updated.get(id))
    treeMapStore.set(updated)
  }
  function formatValue(val: any, node: ITreeNode) {
    const { valueFormatter } = get(propsStore)
    const customFormat = valueFormatter ? valueFormatter(val, node) : undefined
    if (customFormat) {
      return customFormat
    }
    switch (node.type) {
      case 'array':
        return `${node.circularOfId ? 'circular' : ''} [] ${val.length} items`
      case 'object':
        return `${node.circularOfId ? 'circular' : ''} {} ${Object.keys(val).length} keys`
      case 'map':
      case 'set':
        return `${node.circularOfId ? 'circular' : ''} () ${val.size} entries`
      case 'date':
        return `${val.toISOString()}`
      case 'string':
        return `"${val}"`
      case 'boolean':
        return val ? 'true' : 'false'
      default:
        return val
    }
  }
  setContext('app', {
    treeMapStore,
    treeStore,
    propsStore,
    rootElementStore,
    getNode,
    toggleCollapse,
    expandAllNodesToNode,
    formatValue
  })
}
