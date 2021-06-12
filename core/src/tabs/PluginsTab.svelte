<style lang="scss">
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
  }
  .left-panel {
    flex-grow: 0;
    overflow: scroll;
    padding: 0;
    min-width: 190px;
    width: 190px;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
  }
  .empty-state {
    align-items: center;
    color: #ffa2b1;
    display: flex;
    font-size: 14px;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { Plugin } from 'prosemirror-state'

  import { APP_CONTEXT } from '../context.ts'
  import SplitView from './SplitView.svelte'
  import TreeView from '../svelte-tree-view/Main.svelte'
  import List from './List.svelte'
  import Button from '../Button.svelte'

  const { view } = getContext(APP_CONTEXT)
  let plugins = view.state.plugins
  let selectedPlugin = plugins[0]
  $: pluginState = selectedPlugin.getState(view.state)
  $: listItems = plugins.map((p: Plugin) => ({
    key: p.key,
    value: p.key.toUpperCase(),
    empty: !p.getState(view.state)
  }))

  function handlePluginSelect(item: { key: string; value: string }) {
    selectedPlugin = plugins.find(p => p.key === item.key)
  }
  function handleLogState() {
    window._plugin = [selectedPlugin, pluginState]
    console.log(selectedPlugin)
    console.log(pluginState)
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <List {listItems} selectedKey={selectedPlugin.key} onSelect={handlePluginSelect} />
  </div>
  <div slot="right" class="right-panel">
    {#if pluginState}
      <div class="top-row">
        <h2>Plugin state</h2>
        <Button on:click={handleLogState}>log</Button>
      </div>
    {/if}
    {#if pluginState}
      <TreeView data={pluginState} showLogButton showCopyButton />
    {:else}
      <div class="empty-state">Plugin has no state</div>
    {/if}
  </div>
</SplitView>
