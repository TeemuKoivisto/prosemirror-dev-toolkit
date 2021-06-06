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
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    overflow: scroll;
    padding: 1em;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'

  import SplitView from './SplitView.svelte'
  import TreeView from '../svelte-tree-view/Main.svelte'
  import { APP_CONTEXT } from '../context.ts'

  const { view } = getContext(APP_CONTEXT)

  let nodes = view.state.schema.nodes
  let marks = view.state.schema.marks
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <div class="top-row">
      <h2>Nodes</h2>
    </div>
    <TreeView
      class="tree-view"
      data={nodes}
      showLogButton
      showCopyButton
      maxDepth={6}
      omitKeys={['nodes', 'marks', 'topNodeType']}
    />
  </div>
  <div slot="right" class="right-panel">
    <div class="top-row">
      <h2>Marks</h2>
    </div>
    <TreeView
      class="tree-view"
      data={marks}
      showLogButton
      showCopyButton
      maxDepth={6}
      omitKeys={['nodes', 'marks', 'topNodeType']}
    />
  </div>
</SplitView>
