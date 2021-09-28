<script lang="ts">
  import { getContext } from '$context'

  import TreeView from 'svelte-tree-view'
  import SplitView from './SplitView.svelte'
  import Button from '../Button.svelte'

  const { view } = getContext('editor-view')

  let nodes = view.state.schema.nodes
  let marks = view.state.schema.marks
</script>

<SplitView>
  <div slot="left" class="left-panel">
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
        maxDepth: 6,
        omitKeys: ['nodes', 'marks', 'topNodeType']
      }}
    />
  </div>
  <div slot="right" class="right-panel">
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
        maxDepth: 6,
        omitKeys: ['nodes', 'marks', 'topNodeType']
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
  .left-panel {
    overflow: scroll;
    padding: 1em;
  }
  .right-panel {
    border-left: 1px solid rgba($color-red-light, 0.2);
    overflow: scroll;
    padding: 1em;
  }
</style>
