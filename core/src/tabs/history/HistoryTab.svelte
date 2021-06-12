<style lang="scss">
  .left-panel {
    flex-grow: 0;
    padding: 0;
    min-width: 190px;
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
  .entry-row + .entry-row {
    margin-top: 1em;
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

  import { APP_CONTEXT } from '../../context.ts'
  import {
    HistoryEntry,
    HistoryGroup,
    stateHistory,
    shownHistoryGroups
  } from '../../state/stateHistory.store.ts'
  import { mapDocDeltaChildren, mapSelectionDeltaChildren } from './mapDeltas.ts'
  import SplitView from '../SplitView.svelte'
  import TreeView from '../../svelte-tree-view/Main.svelte'
  import HistoryList from './HistoryList.svelte'
  import DiffValue from './DiffValue.svelte'

  const { view } = getContext(APP_CONTEXT)
  let selectedEntry = undefined
  $: listItems = $shownHistoryGroups.map((g: HistoryGroup) => ({
    isGroup: g.isGroup,
    topEntry: $stateHistory.get(g.topEntryId),
    entries: g.entryIds.map(id => $stateHistory.get(id)),
    expanded: g.expanded
  }))

  function handleEntrySelect(id: string, groupIdx: number, wasTopNode: boolean) {
    selectedEntry = $stateHistory.get(id)
    const group = listItems[groupIdx]
    if (group.isGroup && group.entries.length > 1 && wasTopNode) {
      shownHistoryGroups.update(val =>
        val.map((g, idx) => (idx !== groupIdx ? g : { ...g, expanded: !g.expanded }))
      )
    }
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <HistoryList {listItems} selectedId={selectedEntry?.id} onSelect={handleEntrySelect} />
  </div>
  <div slot="right" class="right-panel">
    {#if selectedEntry}
      <div>
        {#if selectedEntry.contentDiff}
          <div class="entry-row">
            <h2>Doc diff</h2>
            <TreeView
              class="tree-view"
              data={selectedEntry.contentDiff}
              showLogButton
              showCopyButton
              valueComponent={DiffValue}
              mapChildren={mapDocDeltaChildren}
              shouldExpandNode={() => true}
            />
          </div>
        {/if}
        {#if selectedEntry.selectionDiff}
          <div class="entry-row">
            <h2>Selection diff</h2>
            <TreeView
              class="tree-view"
              data={selectedEntry.selectionDiff}
              valueComponent={DiffValue}
              shouldExpandNode={() => true}
              mapChildren={mapSelectionDeltaChildren}
            />
          </div>
        {/if}
        {#if selectedEntry.selectionHtml.length > 0}
          <div class="entry-row">
            <h2>Selection content</h2>
            <pre><code>{selectedEntry.selectionHtml}</code></pre>
          </div>
        {/if}
      </div>
    {:else}
      <div class="equal-diff">Docs are equal.</div>
    {/if}
  </div>
</SplitView>
