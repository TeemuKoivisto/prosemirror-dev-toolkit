<script lang="ts">
  import { getContext } from 'svelte'
  import { latestEntry } from '$state/stateHistory.store'

  import SplitView from '../SplitView.svelte'
  import TreeView from 'svelte-tree-view'
  import DocView from './DocView.svelte'
  import Button from '../../Button.svelte'

  const { view } = getContext('editor-view')
  let doc = view.state.doc
  let selectedNode = view.state.doc
  $: jsonNode = selectedNode.toJSON()
  let schema = view.state.schema

  latestEntry.subscribe(e => {
    if (!e) return
    doc = e.state.doc
  })

  function handleNodeSelect(n: any) {
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
      recursionOpts={{
        shouldExpandNode: () => true
      }}
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
