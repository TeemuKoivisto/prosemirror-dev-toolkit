<style lang="scss">
  :root {
    --json-tree-label-color: rgb(133, 217, 239);
    --json-tree-string-color: rgb(184, 226, 72);
    --json-tree-number-color: rgb(184, 226, 72);
  }
  section {
    border-top: 1px solid rgba(255, 162, 177, 0.2);
    color: white;
    display: flex;
    height: 100%;
    width: 100%;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
  }
  h2 {
    font-size: 1em;
    font-weight: 400;
    margin: 0;
    text-transform: uppercase;
  }
  .left-panel {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
  }
  * :global(.tree-view) {
    padding-bottom: 4em;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
    :global(.tree-view) {
      padding-bottom: 2em;
    }
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'

  import TreeView from '../svelte-tree-view/Main.svelte'
  import { APP_CONTEXT } from '../context.ts'

  const { view } = getContext(APP_CONTEXT)

  let nodes = view.state.schema.nodes
  let marks = view.state.schema.marks
</script>

<section>
  <div class="left-panel">
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
  <div class="right-panel">
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
</section>
