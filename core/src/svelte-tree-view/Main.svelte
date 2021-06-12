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
  import { setContext } from 'svelte'
  import { get } from 'svelte/store'
  import { initTreeData, getValueType } from './tree-utils.ts'

  import Test from './Test.svelte'
  import TreeNode from './TreeNode.svelte'

  export let data,
    omitKeys = [],
    maxDepth = 10,
    mapChildren,
    valueFormatter,
    valueComponent,
    shouldExpandNode,
    showLogButton = false,
    showCopyButton = false

  let timer
  let { treeMapStore, treeStore } = initTreeData(data, {
    mapChildren,
    shouldExpandNode,
    maxDepth,
    omitKeys
  })

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
  function formatValue(val: any, node: ITreeNode) {
    const customFormat = valueFormatter ? valueFormatter(val, node) : undefined
    if (customFormat) {
      return customFormat
    }
    switch (node.type) {
      case 'array':
        return `[] ${val.length} items`
      case 'object':
        return `{} ${Object.keys(val).length} keys`
      case 'map':
      case 'set':
        return `() ${val.size} entries`
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
    props: {
      omitKeys,
      maxDepth,
      mapChildren,
      valueFormatter,
      valueComponent,
      shouldExpandNode,
      showLogButton,
      showCopyButton
    },
    getNode,
    toggleCollapse,
    formatValue
  })

  $: {
    const newVals = initTreeData(data, {
      shouldExpandNode,
      mapChildren,
      maxDepth,
      omitKeys
    })
    const newMap = get(newVals.treeMapStore)
    const newTree = get(newVals.treeStore)
    treeMapStore.set(newMap)
    treeStore.set(newTree)
  }
  // $: {
  //   let newProps = {
  //     omitKeys,
  //     maxDepth,
  //     valueFormatter,
  //     valueComponent,
  //     shouldExpandNode,
  //     showLogButton,
  //     showCopyButton
  //   }
  //   console.log('new PROPS', newProps)
  // }
</script>

<section class={$$props.class}>
  {#each $treeStore.children as child}
    <TreeNode id={child.id} />
  {/each}
</section>
