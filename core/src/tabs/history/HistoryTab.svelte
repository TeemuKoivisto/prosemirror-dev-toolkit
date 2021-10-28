<script lang="ts">
  import { stateHistory, shownHistoryGroups, latestEntry } from '$stores/stateHistory'
  import type { HistoryEntry, HistoryGroup } from '$typings/history'
  import { mapDocDeltaChildren, mapSelectionDeltaChildren } from './mapDeltas'

  import SplitView from '../SplitView.svelte'
  import TreeView from 'svelte-tree-view'
  import HistoryList from './HistoryList.svelte'
  import DiffValue from './DiffValue.svelte'
  import Button from '$components/Button.svelte'

  let selectedEntry: HistoryEntry | undefined = undefined,
    showTr = false

  let expandTrTreeView = false
  let transactionRecursionOpts = {
    maxDepth: 12,
    stopCircularRecursion: true,
    omitKeys: ['schema'],
    shouldExpandNode: () => expandTrTreeView
  }
  $: listItems = $shownHistoryGroups.map((g: HistoryGroup) => ({
    isGroup: g.isGroup,
    topEntry: $stateHistory.get(g.topEntryId),
    entries: g.entryIds.map(id => $stateHistory.get(id)),
    expanded: g.expanded
  }))
  latestEntry.subscribe(v => {
    if (v) selectedEntry = v
  })

  function toggleShowTr() {
    showTr = !showTr
  }
  function handleLogTr() {
    console.info('%c [prosemirror-dev-toolkit]: Property added to window._tr', 'color: #b8e248')
    console.log(selectedEntry?.tr)
    window._tr = selectedEntry?.tr
  }
  /**
   * Handles the clicks of the history entries.
   *
   * Sets the clicked entry as the selectedEntry but in the case of topNode, meaning
   * in a selection group (shown with [x] number) the entry has a sublist of entries
   * where the previous is duplicated as the first entry. Therefore on expanding the group
   * selecting the first sub-entry, otherwise collapsing but still keeping the topNode selected.
   * Kinda confusing but eh.
   */
  function handleEntrySelect(id: string, groupIdx: number, wasTopNode: boolean) {
    selectedEntry = $stateHistory.get(id)
    const group = listItems[groupIdx]
    if (group.isGroup && group.entries.length > 1 && wasTopNode) {
      shownHistoryGroups.update(val =>
        val.map((g, idx) => (idx !== groupIdx ? g : { ...g, expanded: !g.expanded }))
      )
    }
  }
  function handleToggleExpandTrTreeView() {
    expandTrTreeView = !expandTrTreeView
    transactionRecursionOpts = {
      ...transactionRecursionOpts,
      shouldExpandNode: () => expandTrTreeView
    }
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <!-- Cant use optional chaining here as it wont get transpiled correctly to ES5 :( -->
    <HistoryList {listItems} selectedId={selectedEntry?.id || ''} onSelect={handleEntrySelect} />
  </div>
  <div slot="right" class="right-panel">
    {#if selectedEntry}
      <div>
        {#if selectedEntry.contentDiff}
          <div class="entry-row">
            <div class="title-container">
              <h2>Doc diff</h2>
              <Button class="hidden">log</Button>
            </div>
            <TreeView
              class="tree-view"
              data={selectedEntry.contentDiff}
              showLogButton
              showCopyButton
              valueComponent={DiffValue}
              recursionOpts={{
                maxDepth: 12,
                mapChildren: mapDocDeltaChildren,
                shouldExpandNode: () => true
              }}
            />
          </div>
        {/if}
        {#if selectedEntry.selectionDiff}
          <div class="entry-row">
            <div class="title-container">
              <h2>Selection diff</h2>
              <Button class="hidden">log</Button>
            </div>
            <TreeView
              class="tree-view"
              data={selectedEntry.selectionDiff}
              valueComponent={DiffValue}
              recursionOpts={{
                mapChildren: mapSelectionDeltaChildren,
                shouldExpandNode: () => true
              }}
            />
          </div>
        {/if}
        {#if selectedEntry.selectionHtml.length > 0}
          <div class="entry-row">
            <div class="title-container">
              <h2>Selection content</h2>
              <Button class="hidden">log</Button>
            </div>
            <pre class="selection-html"><code>{@html selectedEntry.selectionHtml}</code></pre>
          </div>
        {/if}
        <div class="entry-row">
          <div class="title-container">
            <h2>Transaction</h2>
            <div>
              {#if showTr}
                <Button on:click={handleToggleExpandTrTreeView}>
                  {expandTrTreeView ? 'collapse' : 'expand'}
                </Button>
                <Button on:click={handleLogTr}>log</Button>
              {/if}
              <Button on:click={toggleShowTr}>
                {showTr ? 'hide' : 'show'}
              </Button>
            </div>
          </div>
          {#if showTr}
            <TreeView
              class="tree-view"
              data={selectedEntry.tr}
              showLogButton
              showCopyButton
              recursionOpts={transactionRecursionOpts}
            />
          {/if}
        </div>
      </div>
    {:else}
      <div class="equal-diff">Docs are equal.</div>
    {/if}
  </div>
</SplitView>

<style lang="scss">
  .left-panel {
    flex-grow: 0;
    padding: 0;
    min-width: 190px;
    width: 190px;
  }
  .title-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .entry-row + .entry-row {
    margin-top: 1em;
  }
  .selection-html {
    font-weight: 100;
    margin: 0.5em 0 0 0;
    padding: 0;
  }
  .equal-diff {
    align-items: center;
    color: var(--color-red-light);
    display: flex;
    font-size: 14px;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
</style>
