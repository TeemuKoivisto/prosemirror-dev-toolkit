<style lang="scss">
  :root {
    --json-tree-label-color: rgb(133, 217, 239);
    --json-tree-string-color: rgb(184, 226, 72);
    --json-tree-number-color: rgb(184, 226, 72);
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
  }
  .left-panel {
    overflow: scroll;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    flex-grow: 0;
    width: 220px;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { APP_CONTEXT } from '../context.ts'

  import JSONTree from 'svelte-json-tree'
  import SplitView from './SplitView.svelte'
  import TreeView from '../svelte-tree-view/Main.svelte'
  import Button from '../Button.svelte'

  const { view } = getContext(APP_CONTEXT)
  let doc = view.state.doc.toJSON()
  let selection = view.state.selection.toJSON()

  function handleClickLogDoc() {
    console.log(doc)
    window._doc = doc
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <div class="top-row">
      <h2>Current doc</h2>
      <Button on:click={handleClickLogDoc}>log</Button>
    </div>
    <TreeView data={doc} showLogButton showCopyButton />
  </div>
  <div slot="right" class="right-panel">
    <div class="top-row">
      <h2>Selection</h2>
      <button>▼</button>
    </div>
    <!-- See https://github.com/sveltejs/svelte/issues/3165#issuecomment-804354493 -->
    {#each [...[]] as _}
      <div />
    {:else}
      <JSONTree value={selection} />
    {/each}
  </div>
</SplitView>
