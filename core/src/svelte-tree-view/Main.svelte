<style>
  * {
    box-sizing: border-box;
  }
  section {
    font-family: Helvetica Neue, Calibri Light, Roboto, sans-serif;
    font-size: 13px;
    height: max-content;
    width: max-content;
  }
</style>

<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import { get } from 'svelte/store'

  import { createNode, recurseObjectProperties, getValueType } from './tree-utils.ts'
  import { createContext } from './context.ts'

  import TreeNode from './TreeNode.svelte'

  export let data,
    leftIndent = 4,
    showLogButton = false,
    showCopyButton = false,
    valueComponent = undefined,
    recursionOpts = {},
    valueFormatter = undefined

  let rootElement: HTMLElement | null = null
  const defaultRecursionOpts = {
    maxDepth: 10,
    omitKeys: [],
    stopRecursion: false,
    shouldExpandNode: () => false
  }
  let props = {
    leftIndent,
    showLogButton,
    showCopyButton,
    valueComponent,
    recursionOpts: {
      ...defaultRecursionOpts,
      ...recursionOpts
    },
    valueFormatter
  }
  $: {
    props = {
      leftIndent,
      showLogButton,
      showCopyButton,
      valueComponent,
      valueFormatter,
      recursionOpts: props.recursionOpts
    }
    // todo update props inside context?
  }
  $: {
    const nodeRecursionOpts = {
      ...defaultRecursionOpts,
      ...recursionOpts
    }
    const recomputeExpandNode =
      props.recursionOpts.shouldExpandNode !== nodeRecursionOpts.shouldExpandNode
    const treeMap = new Map()
    const oldTreeMap = get(treeMapStore)
    const iteratedValues = new Map()
    const newTree = recurseObjectProperties(
      -1,
      'root',
      data,
      -1,
      null,
      treeMap,
      oldTreeMap,
      iteratedValues,
      recomputeExpandNode,
      nodeRecursionOpts
    )
    treeMapStore.set(treeMap)
    treeStore.set(newTree)
    props.recursionOpts = nodeRecursionOpts
  }

  createContext(props)
  const { treeMapStore, treeStore, rootElementStore } = getContext('app')

  onMount(() => {
    rootElementStore.set(rootElement)
  })
</script>

<section class={$$props.class} bind:this={rootElement}>
  {#each $treeStore.children as child}
    <TreeNode id={child.id} />
  {/each}
</section>
