<style lang="scss">
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    flex-grow: 0;
    min-width: 220px;
    width: 220px;
  }
  :global(.m-top) {
    margin-top: 1em;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { APP_CONTEXT } from '../../context.ts'
  import { latestEntry } from '../../state/stateHistory.store.ts'

  import SplitView from '../SplitView.svelte'
  import TreeView from '../../svelte-tree-view/Main.svelte'
  import DocView from './DocView.svelte'
  import Button from '../../Button.svelte'

  const { view } = getContext(APP_CONTEXT)
  let doc = view.state.doc
  let node = view.state.doc.toJSON()
  let schema = view.state.schema

  latestEntry.subscribe(e => {
    doc = e.state.doc
  })

  function handleNodeSelect(n: any) {
    node = n.toJSON()
  }
  function handleClickLogNode() {
    console.log(node)
    window._node = node
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <div class="top-row">
      <h2>Current doc</h2>
    </div>
    <DocView class="m-top" {doc} {schema} {handleNodeSelect} />
  </div>
  <div slot="right" class="right-panel">
    <div class="top-row">
      <h2>Node info</h2>
      <Button on:click={handleClickLogNode}>log</Button>
    </div>
    <TreeView class="m-top" data={node} shouldExpandNode={() => true} />
  </div>
</SplitView>
