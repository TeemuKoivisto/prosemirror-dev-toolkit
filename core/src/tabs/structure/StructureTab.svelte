<style lang="scss">
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    flex-grow: 0;
    width: 220px;
  }
  :global(.m-top) {
    margin-top: 1em;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { APP_CONTEXT } from '../../context.ts'

  import SplitView from '../SplitView.svelte'
  import TreeView from '../../svelte-tree-view/Main.svelte'
  import DocView from './DocView.svelte'
  import Button from '../../Button.svelte'

  const { view } = getContext(APP_CONTEXT)
  let doc = view.state.doc
  let schema = view.state.schema

  function handleClickLogNode() {
    console.log(doc)
    window._doc = doc
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <div class="top-row">
      <h2>Current doc</h2>
    </div>
    <DocView class="m-top" {doc} {schema} />
  </div>
  <div slot="right" class="right-panel">
    <div class="top-row">
      <h2>Node info</h2>
      <Button on:click={handleClickLogNode}>log</Button>
    </div>
    <TreeView class="m-top" data={doc} />
  </div>
</SplitView>
