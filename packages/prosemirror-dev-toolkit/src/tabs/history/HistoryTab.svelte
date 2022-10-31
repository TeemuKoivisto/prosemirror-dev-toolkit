<script lang="ts">
  import {
    shownHistory,
    setMetaFilter,
    shownHistoryGroups,
    shownLatestEntry,
    toggleGroupExpanded
  } from '$stores/stateHistory'
  import type { HistoryEntry, HistoryGroup } from '$typings/history'
  import { mapDocDeltaChildren, mapSelectionDeltaChildren } from './mapDeltas'
  import TreeView from 'svelte-tree-view'

  import SplitView from '../SplitView.svelte'
  import HistoryList from './HistoryList.svelte'
  import DiffValue from './DiffValue.svelte'
  import Button from '$components/Button.svelte'

  import { getContext } from '$context'

  let selectedEntry: HistoryEntry | undefined = undefined,
    showTr = false,
    showOptions = true,
    debouncedMetaChange: ReturnType<typeof setTimeout>

  const { replaceEditorContent } = getContext('editor-view')

  let expandTrTreeView = false
  let transactionRecursionOpts = {
    maxDepth: 24,
    stopCircularRecursion: true,
    omitKeys: ['schema'],
    shouldExpandNode: () => expandTrTreeView
  }
  // $: listItems = $shownHistoryGroups.map((g: HistoryGroup) => ({
  //   id: g.id,
  //   isGroup: g.isGroup,
  //   topEntry: $shownHistory.get(g.topEntryId),
  //   entries: g.entryIds.map(id => $shownHistory.get(id)),
  //   expanded: g.expanded
  // }))

  shownLatestEntry.subscribe(v => {
    if (v) selectedEntry = v
  })

  function handleToggleOptions() {
    showOptions = !showOptions
  }
  function handleMetaFilterChange(ev: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const { value } = ev.currentTarget
    clearTimeout(debouncedMetaChange)
    debouncedMetaChange = setTimeout(() => {
      setMetaFilter(value)
    }, 100)
  }
  function toggleShowTr() {
    showTr = !showTr
  }
  function handleLogTr() {
    console.info('%c [prosemirror-dev-toolkit]: Property added to window._trs', 'color: #b8e248')
    console.log(selectedEntry?.trs)
    window._trs = selectedEntry?.trs
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
  function handleEntrySelect(
    e: CustomEvent<{ id: string | undefined; groupIdx: number; wasTopNode: boolean }>
  ) {
    const { id = '', groupIdx, wasTopNode } = e.detail
    selectedEntry = $shownHistory.get(id)
    if (!selectedEntry) return
    const group = $shownHistoryGroups[groupIdx]
    if (group.isGroup && group.entries.length > 1 && wasTopNode) {
      toggleGroupExpanded(group.id)
    }
  }
  function handleEntryDblClick(e: CustomEvent<{ id?: string }>) {
    selectedEntry = $shownHistory.get(e.detail.id || '')
    selectedEntry && replaceEditorContent(selectedEntry.state)
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
    <div class="options">
      ▶
      <div class:hidden={!showOptions}>
        <div class="latest-container">
          <label for="toolkit-track-latest-input">Track latest</label>
          <input id="toolkit-track-latest-input" type="checkbox" />
        </div>
        <div class="filter-container">
          <label for="toolkit-meta-filter-input">Filter by meta</label>
          <input id="toolkit-meta-filter-input" on:input={handleMetaFilterChange} />
        </div>
      </div>
      <button class="option-btn" on:click={handleToggleOptions}> ⚙️ </button>
    </div>
    <HistoryList
      listItems={$shownHistoryGroups}
      selectedId={selectedEntry?.id || ''}
      on:click-item={handleEntrySelect}
      on:dblclick-item={handleEntryDblClick}
    />
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
            <div class="transaction-buttons">
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
              data={selectedEntry.trs[0]}
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
  :global(.hidden) {
    display: none;
    visibility: hidden;
  }
  .left-panel {
    flex-grow: 0;
    padding: 0;
    min-width: 190px;
    width: 190px;
  }
  .options {
    position: relative;
    margin: 0.75em;
  }
  .option-btn {
    background: transparent;
    border: 0;
    cursor: pointer;
    margin: 0;
    padding: 0;
    position: absolute;
    right: -2px;
    top: -2px;
  }
  .latest-container {
    display: flex;
    flex-direction: row;
  }
  .filter-container {
    input {
      background: transparent;
      color: white;
      margin-top: 4px;
      width: 100%;
    }
  }
  .title-container {
    align-items: center;
    display: flex;
  }
  .transaction-buttons {
    margin-left: 2rem;
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
    color: $color-red-light;
    display: flex;
    font-size: 14px;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
</style>
