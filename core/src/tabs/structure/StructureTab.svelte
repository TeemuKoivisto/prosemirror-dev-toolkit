<script lang="ts">
  import type { Node as PMNode, Schema } from 'prosemirror-model'
  import { getContext } from '$context'
  import { latestEntry } from '$stores/stateHistory'

  import TreeView from 'svelte-tree-view'
  import SplitView from '../SplitView.svelte'
  import DocView from './DocView.svelte'
  import Button from '../../Button.svelte'

  const { view } = getContext('editor-view')
  let doc: PMNode = view.state.doc
  let selectedNode = view.state.doc
  $: jsonNode = selectedNode.toJSON()
  let schema: Schema = view.state.schema
  let timer: number | undefined

  latestEntry.subscribe(e => {
    if (!e) return
    clearTimeout(timer)
		timer = setTimeout(() => {
      doc = e.state.doc
		}, 100)
  })

  function handleNodeSelect(n: PMNode) {
    selectedNode = n
  }
  function handleClickLogNode() {
    console.log(selectedNode)
    window._node = selectedNode
    console.info('%c [prosemirror-dev-toolkit]: Property added to window._node', 'color: #b8e248')
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <div class="top-row">
      <h2>Current doc</h2>
      <Button class="hidden">log</Button>
    </div>
    <DocView class="m-top" {doc} {schema} {handleNodeSelect} />
  </div>
  <div slot="right" class="right-panel">
    <div class="top-row">
      <h2>Node info</h2>
      <Button on:click={handleClickLogNode}>log</Button>
    </div>
    <TreeView
      class="m-top"
      data={jsonNode}
    />
  </div>
</SplitView>

<style lang="scss">
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .right-panel {
    border-left: 1px solid rgba($color-red-light, 0.2);
    flex-grow: 0;
    min-width: 220px;
    width: 220px;
  }
  :global(.split-view .m-top) {
    margin-top: 0.5em;
  }
</style>
