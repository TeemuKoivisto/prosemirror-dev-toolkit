<style lang="scss">
  .left-panel {
    border-right: 1px solid #604c68;
    flex-grow: 0;
    padding: 0;
    width: 190px;
  }
  .equal-diff {
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

  import { APP_CONTEXT } from '../context.ts'
  import SplitView from './SplitView.svelte'
  import List from './List.svelte'

  const { view } = getContext(APP_CONTEXT)
  let plugins = view.state.plugins
  let selectedPlugin = writable(plugins[0])
  $: listItems = plugins.map((p: Plugin) => ({
    key: p.key,
    value: p.key.toUpperCase(),
    empty: false
  }))

  function handlePluginSelect(p: { key: string; value: string }) {
    console.log(p)
    // selectedPlugin = plugins.find(p => p.key === p.key)
    selectedPlugin.set(plugins.find(p => p.key === p.key))
  }
</script>

<SplitView leftPanelWidth={'190px'}>
  <div slot="left" class="left-panel">
    <List {listItems} selectedItem={$selectedPlugin.key} onSelect={handlePluginSelect} />
  </div>
  <div slot="right">
    <div class="equal-diff">Docs are equal.</div>
  </div>
</SplitView>
