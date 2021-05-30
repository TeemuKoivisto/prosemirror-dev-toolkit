<style>
  * {
    box-sizing: border-box;
  }
  section {
    font-family: Helvetica Neue, Calibri Light, Roboto, sans-serif;
    font-size: 13px;
    height: max-content;
  }
</style>

<script lang="ts">
  import { setContext, getContext } from 'svelte'
  import { writable } from 'svelte/store'

  import Test from './Test.svelte'
  import TreeNode from './TreeNode.svelte'
  import { APP_CONTEXT, recurseObjectProperties, getValueType } from './tree-utils.ts'

  export let data,
    omitKeys = [],
    maxDepth = 10,
    valueFormatter,
    autoCollapser,
    showLogButton = false,
    showCopyButton = false

  let props = {
    data,
    valueFormatter,
    autoCollapser,
    showLogButton,
    showCopyButton
  }
  let treeMap = new Map()
  let tree = recurseObjectProperties('root', data, 0, null, treeMap, {
    autoCollapser,
    maxDepth,
    omitKeys
  })
  let treeMapStore = writable(treeMap)
  let treeStore = writable(tree)

  setContext(APP_CONTEXT, {
    treeMap,
    tree,
    treeMapStore,
    treeStore,
    props,
    getRootNode() {
      return tree
    },
    getNode(id: string) {
      return treeMap.get(id)
    },
    toggleCollapse(id: string) {
      const node = treeMap.get(id)
      if (node) {
        treeMap.set(node.id, { ...node, collapsed: !node.collapsed })
        treeMapStore.update(m => new Map(m.set(node.id, { ...node, collapsed: !node.collapsed })))
      } else {
        console.warn(`Attempted to collapse non-existent node: ${id}`)
      }
    },
    formatValue(val: any) {
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
  })
</script>

<section class={$$props.class}>
  {#each tree.children as child}
    <TreeNode id={child.id} />
  {/each}
</section>
