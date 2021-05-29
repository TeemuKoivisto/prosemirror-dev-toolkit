<style>
  section {
    font-size: 16px;
    height: 100%;
  }
</style>

<script lang="ts">
  import { setContext, getContext } from 'svelte'
  import { writable } from 'svelte/store'

  import Test from './Test.svelte'
  import TreeNode from './TreeNode.svelte'
  import { APP_CONTEXT, recurseObjectProperties, getValueType } from './tree-utils.ts'
  import { ITreeNode } from './types.ts'

  export let data, valueFormatter
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
      treeMap.set(node.id, { ...node, collapsed: !node.collapsed })
      treeMapStore.update(m => new Map(m.set(node.id, { ...node, collapsed: !node.collapsed })))
    } else {
      console.warn(`Attempted to collapse non-existent node: ${id}`)
    }
  }

  function formatValue(val: any) {
    switch (getValueType(val)) {
      case 'array':
        return `[] ${val.length} items`
      case 'object':
        return `{} ${Object.keys(val).length} keys`
      case 'string':
        return `"${val}"`
      case 'boolean':
        return val ? 'true' : 'false'
      default:
        return val
    }
  }

  setContext(APP_CONTEXT, {
    treeMap,
    tree,
    treeMapStore,
    treeStore,
    getRootNode,
    getNode,
    toggleCollapse,
    formatValue
  })
</script>

<section>
  {#each tree.children as child}
    <TreeNode key={child.id} />
  {/each}
</section>
