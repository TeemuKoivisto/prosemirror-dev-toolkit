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
    valueFormatter,
    valueComponent,
    defaultCollapse,
    showLogButton = false,
    showCopyButton = false

  let timer
  let { treeMapStore, treeStore } = initTreeData(data, {
    defaultCollapse,
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

  setContext('app', {
    treeMapStore,
    treeStore,
    props: {
      omitKeys,
      maxDepth,
      valueFormatter,
      valueComponent,
      defaultCollapse,
      showLogButton,
      showCopyButton
    },
    getNode,
    toggleCollapse,
    formatValue
  })

  const debounce = (fn: () => void) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, 150)
  }

  $: {
    // debounce(() => {
    // })
    const newVals = initTreeData(data, {
      defaultCollapse,
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
  //     defaultCollapse,
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
