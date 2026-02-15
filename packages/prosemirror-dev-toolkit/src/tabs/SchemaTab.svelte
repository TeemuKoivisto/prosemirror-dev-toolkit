<script lang="ts">
  import { getContext } from '$context'

  import TreeView from 'svelte-tree-view'
  import SplitView from './SplitView.svelte'
  import Button from '$components/Button.svelte'

  const { view } = getContext('editor-view')

  let nodes = view.state.schema.nodes
  let marks = view.state.schema.marks
</script>

<SplitView>
  {#snippet left()}
    <div class="split-view-left-panel">
      <div class="top-row">
        <h2>Nodes</h2>
        <Button class="hidden">log</Button>
      </div>
      <TreeView
        class="tree-view"
        data={nodes}
        showLogButton
        showCopyButton
        recursionOpts={{
          stopCircularRecursion: true
        }}
      />
    </div>
  {/snippet}
  {#snippet right()}
    <div class="split-view-right-panel">
      <div class="top-row">
        <h2>Marks</h2>
        <Button class="hidden">log</Button>
      </div>
      <TreeView
        class="tree-view"
        data={marks}
        showLogButton
        showCopyButton
        recursionOpts={{
          stopCircularRecursion: true
        }}
      />
    </div>
  {/snippet}
</SplitView>

<style>
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .split-view-left-panel {
    overflow: scroll;
    padding: 1em;
  }
  .split-view-right-panel {
    border-left: 1px solid rgba(var(--color-red-light-rgb), 0.2);
    overflow: scroll;
    padding: 1em;
  }
</style>
