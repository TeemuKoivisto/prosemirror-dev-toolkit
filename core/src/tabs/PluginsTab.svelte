<script lang="ts">
  import { getContext } from '$context'
  import type { EditorState } from 'prosemirror-state'
  import { latestEntry } from '$stores/stateHistory'

  import SplitView from './SplitView.svelte'
  import TreeView from 'svelte-tree-view'
  import List from './List.svelte'
  import Button from '$components/Button.svelte'

  import type { Plugin } from '$typings/pm'

  const { view } = getContext('editor-view')
  let expandPluginState = false
  let recursionOpts = {
    maxDepth: 10,
    stopCircularRecursion: true,
    shouldExpandNode: () => expandPluginState
  }
  let editorState: EditorState = view.state
  let plugins = editorState.plugins as Plugin[]
  let selectedPlugin = plugins[0] as Plugin | undefined
  $: pluginState = selectedPlugin?.getState(editorState) as any
  $: listItems = plugins.map((p: Plugin) => ({
    key: p.key, // TODO this can be undefined??
    value: p.key.toUpperCase(),
    empty: !p.getState(editorState)
  }))

  latestEntry.subscribe(e => {
    if (!e) return
    editorState = e.state
    plugins = editorState.plugins as Plugin[]
    selectedPlugin = plugins.find(p => p.key === selectedPlugin?.key) as Plugin
  })

  function handlePluginSelect(item: { key: string; value: string }) {
    selectedPlugin = plugins.find(p => p.key === item.key) as Plugin
  }
  function handleToggleExpand() {
    expandPluginState = !expandPluginState
    recursionOpts = { ...recursionOpts, shouldExpandNode: () => expandPluginState }
  }
  function handleLogState() {
    window._plugin = [selectedPlugin, pluginState]
    console.info('%c [prosemirror-dev-toolkit]: Property added to window._plugin', 'color: #b8e248')
    console.log(selectedPlugin)
    console.log(pluginState)
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <List {listItems} selectedKey={selectedPlugin?.key} onSelect={handlePluginSelect} />
  </div>
  <div slot="right" class="right-panel">
    {#if pluginState}
      <div class="top-row">
        <h2>Plugin state</h2>
        <div>
          <Button on:click={handleToggleExpand}>
            {expandPluginState ? 'collapse' : 'expand'}
          </Button>
          <Button on:click={handleLogState}>log</Button>
        </div>
      </div>
    {/if}
    {#if pluginState}
      <TreeView data={pluginState} showLogButton showCopyButton {recursionOpts} />
    {:else}
      <div class="empty-state">Plugin has no state</div>
    {/if}
  </div>
</SplitView>

<style lang="scss">
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5em;
  }
  .left-panel {
    flex-grow: 0;
    overflow: scroll;
    padding: 0;
    min-width: 190px;
    width: 190px;
  }
  .right-panel {
    border-left: 1px solid rgba($color-red-light, 0.2);
  }
  .empty-state {
    align-items: center;
    color: $color-red-light;
    display: flex;
    font-size: 14px;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
</style>
