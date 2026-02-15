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
  let expandPluginState = $state(false)
  let recursionOpts = $state({
    maxDepth: 10,
    stopCircularRecursion: true,
    shouldExpandNode: () => expandPluginState
  })
  let editorState: EditorState = $state(view.state)
  // svelte-ignore state_referenced_locally
  let plugins = $state(editorState.plugins as Plugin[])
  // svelte-ignore state_referenced_locally
  let selectedPlugin = $state(plugins.at(0))
  // I don't know how, but I've found in one editor plugin did not have getState method
  const pluginState = $derived(
    selectedPlugin?.getState ? selectedPlugin.getState(editorState) : (undefined as any)
  )
  const listItems = $derived(
    plugins.map((p: Plugin) => ({
      key: p.key,
      value: p.key.toUpperCase(),
      empty: !(p.getState && p.getState(editorState))
    }))
  )

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
  {#snippet left()}
    <div class="split-view-left-panel">
      <List {listItems} selectedKey={selectedPlugin?.key} onSelect={handlePluginSelect} />
    </div>
  {/snippet}
  {#snippet right()}
    <div class="split-view-right-panel">
      {#if pluginState}
        <div class="top-row">
          <h2>Plugin state</h2>
          <div>
            <Button onclick={handleToggleExpand}>
              {expandPluginState ? 'collapse' : 'expand'}
            </Button>
            <Button onclick={handleLogState}>log</Button>
          </div>
        </div>
      {/if}
      {#if pluginState}
        <TreeView data={pluginState} showLogButton showCopyButton {recursionOpts} />
      {:else}
        <div class="empty-state">Plugin has no state</div>
      {/if}
    </div>
  {/snippet}
</SplitView>

<style>
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5em;
  }
  .split-view-left-panel {
    flex-grow: 0;
    overflow: scroll;
    padding: 0;
    min-width: 190px;
    width: 190px;
  }
  .split-view-right-panel {
    border-left: 1px solid rgba(var(--color-red-light-rgb), 0.2);
  }
  .empty-state {
    align-items: center;
    color: var(--color-red-light);
    display: flex;
    font-size: 14px;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
</style>
