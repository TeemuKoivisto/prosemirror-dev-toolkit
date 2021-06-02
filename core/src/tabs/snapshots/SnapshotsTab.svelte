<style lang="scss">
  .left-panel {
    border-right: 1px solid #604c68;
    flex-grow: 0;
    padding: 0;
    width: 190px;
  }
  .no-snapshots {
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

  import { APP_CONTEXT } from '../../context.ts'
  import SplitView from './../SplitView.svelte'
  import List from './../List.svelte'

  const { view } = getContext(APP_CONTEXT)
  let plugins = view.state.plugins
  let selectedPlugin = plugins[0]
  $: listItems = plugins.map((p: Plugin) => ({
    key: p.key,
    value: p.key.toUpperCase(),
    empty: false
  }))

  function handlePluginSelect(item: { key: string; value: string }) {
    selectedPlugin = plugins.find(p => p.key === item.key)
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <List {listItems} selectedKey={selectedPlugin.key} onSelect={handlePluginSelect} />
  </div>
  <div slot="right">
    <div class="no-snapshots">Save snapshots by clicking "Save Snapshot" button.</div>
  </div>
</SplitView>
