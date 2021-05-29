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
    flex-grow: 1;
    overflow: scroll;
    padding: 1em;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    display: flex;
    flex-direction: column;
    padding: 1em;
    width: 220px;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { APP_CONTEXT } from '../context.ts'
  import JSONTree from 'svelte-json-tree'
  import TreeView from '../svelte-tree-view/SvelteTreeView.svelte'

  const { view } = getContext(APP_CONTEXT)
  let doc = view.state.doc.toJSON()
  let selection = view.state.selection.toJSON()
</script>

<section>
  <div class="left-panel">
    <div class="top-row">
      <h2>Current doc</h2>
      <button>log state</button>
    </div>
    <!-- See https://github.com/sveltejs/svelte/issues/3165#issuecomment-804354493 -->
    {#each [...[]] as _}
      <div />
    {:else}
      <TreeView data={doc} />
    {/each}
  </div>
  <div class="right-panel">
    <div class="top-row">
      <h2>Selection</h2>
      <button>▼</button>
    </div>
    {#each [...[]] as _}
      <div />
    {:else}
      <JSONTree value={selection} />
    {/each}
  </div>
</section>
