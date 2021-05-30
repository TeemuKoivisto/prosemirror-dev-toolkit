<style lang="scss">
  :root {
    --left-panel-width: 220px;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { APP_CONTEXT } from '../context.ts'
  import JSONTree from 'svelte-json-tree'
  import SplitView from './SplitView.svelte'
  import TreeView from '../svelte-tree-view/Main.svelte'

  const { view } = getContext(APP_CONTEXT)
  let doc = view.state.doc.toJSON()
  let selection = view.state.selection.toJSON()
</script>

<SplitView rightPanelWidth={'220px'}>
  <div slot="left" style={'width: 220px'}>
    <div class="top-row">
      <h2>Current doc</h2>
      <button>log state</button>
    </div>
    <!-- See https://github.com/sveltejs/svelte/issues/3165#issuecomment-804354493 -->
    {#each [...[]] as _}
      <div />
    {:else}
      <TreeView data={doc} showLogButton showCopyButton />
    {/each}
  </div>
  <div slot="right">
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
</SplitView>
