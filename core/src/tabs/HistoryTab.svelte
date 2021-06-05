<style lang="scss">
  .left-panel {
    border-right: 1px solid #604c68;
    flex-grow: 0;
    padding: 0;
    width: 190px;
  }
  .entry-row {
    h2 {
      margin-bottom: 1em;
    }
    pre {
      margin: 0;
      padding: 0;
    }
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
  import { HistoryEntry, stateHistory } from '../state/stateHistory.store.ts'
  import SplitView from './SplitView.svelte'
  import TreeView from '../svelte-tree-view/Main.svelte'
  import List from './List.svelte'
  import DiffValue from '../state/DiffValue.svelte'

  const { view } = getContext(APP_CONTEXT)
  let selectedEntry = $stateHistory[0]
  $: listItems = $stateHistory.map((e: HistoryEntry) => ({
    key: e.id,
    value: e.timeStr
  }))

  function handleEntrySelect(item: { key: string; value: string }) {
    selectedEntry = $stateHistory.find(e => e.id === item.key)
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <List {listItems} selectedKey={selectedEntry?.id} onSelect={handleEntrySelect} />
  </div>
  <div slot="right">
    {#if selectedEntry}
      <div>
        {#if selectedEntry.diff}
          <div class="entry-row">
            <h2>Doc diff</h2>
            <TreeView
              class="tree-view"
              data={selectedEntry.diff}
              showLogButton
              showCopyButton
              valueComponent={DiffValue}
              maxDepth={6}
              omitKeys={['nodes', 'marks', 'topNodeType']}
            />
          </div>
        {/if}
        {#if selectedEntry.selection}
          <div class="entry-row">
            <h2>Selection diff</h2>
            <TreeView class="tree-view" data={selectedEntry.selection} />
          </div>
        {/if}
        {#if selectedEntry.selectionContent.length > 0}
          <div class="entry-row">
            <h2>Selection content</h2>
            <pre><code>{selectedEntry.selectionContent}</code></pre>
          </div>
        {/if}
      </div>
    {:else}
      <div class="equal-diff">Docs are equal.</div>
    {/if}
  </div>
</SplitView>
