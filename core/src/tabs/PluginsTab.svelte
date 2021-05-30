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
    overflow: scroll;
    width: 220px;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
    }
    button {
      background: transparent;
      border: 0;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      display: flex;
      height: 100%;
      padding: 0.75em 1.5em;
      text-transform: uppercase;
      width: 100%;
      &:hover {
        background: rgba(255, 162, 177, 0.4);
      }
    }
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    flex-grow: 1;
    padding: 1em;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { Plugin } from 'prosemirror-state'

  import { APP_CONTEXT } from '../context.ts'
  import JSONTree from 'svelte-json-tree'
  import TreeView from '../svelte-tree-view/Main.svelte'
  import List from './List.svelte'

  const { view } = getContext(APP_CONTEXT)
  let plugins = view.state.plugins
  let selectedPlugin = plugins[0]
  $: listItems = plugins.map((p: Plugin) => ({
    key: p.key,
    value: p.key.toUpperCase(),
    empty: !p.spec.state
  }))

  function handlePluginSelect(p: { key: string; value: string }) {
    console.log(p)
    selectedPlugin = plugins.find(p => p.key === p.key)
  }
</script>

<section>
  <div class="left-panel">
    <List {listItems} selectedItem={selectedPlugin?.key} onSelect={handlePluginSelect} />
  </div>
  <div class="right-panel">
    <div class="top-row">
      <h2>Plugin state</h2>
      <button>log state</button>
    </div>
    <!-- See https://github.com/sveltejs/svelte/issues/3165#issuecomment-804354493 -->
    {#each [...[]] as _}
      <div />
    {:else}
      <TreeView data={selectedPlugin} showLogButton showCopyButton />
    {/each}
  </div>
</section>
