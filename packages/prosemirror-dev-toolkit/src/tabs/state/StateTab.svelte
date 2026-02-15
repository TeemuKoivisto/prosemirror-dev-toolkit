<script lang="ts">
  import { getContext } from '$context'
  import { latestEntry } from '$stores/stateHistory'
  import { getActiveMarks } from './getActiveMarks'
  import { createSelection, createFullSelection } from './selection'

  import TreeView from 'svelte-tree-view'
  import type { TreeNode } from 'svelte-tree-view'
  import SplitView from '../SplitView.svelte'
  import Button from '$components/Button.svelte'

  const { view } = getContext('editor-view')
  let doc = $state(view.state.doc.toJSON())
  let selection = $state(createSelection(view.state.selection))
  let currentState = $state(view.state)
  let activeMarks: string[] = $state([])
  let nodeSize = $state(view.state.doc.nodeSize)
  let childCount = $state(view.state.doc.childCount)
  let expandedSelection = $state(false)

  latestEntry.subscribe(e => {
    if (!e) return
    const { state } = e
    currentState = state
    doc = state.doc.toJSON()
    selection = expandedSelection
      ? createFullSelection(state.selection)
      : createSelection(state.selection)
    activeMarks = getActiveMarks(state)
    nodeSize = state.doc.nodeSize
    childCount = state.doc.childCount
  })

  function handleClickLogDoc() {
    console.log(doc)
    window._doc = doc
  }
  function handleExpandSelection() {
    expandedSelection = !expandedSelection
    if (expandedSelection) {
      selection = createFullSelection(currentState.selection)
    } else {
      selection = createSelection(currentState.selection)
    }
  }
  function formatDocNodeValue(val: any, n: TreeNode) {
    if (n.type === 'object' && val.type) {
      return `{} ${val.type}`
    }
  }
</script>

<SplitView>
  {#snippet left()}
    <div class="left-panel">
      <div class="top-row">
        <h2>Current doc</h2>
        <Button onclick={handleClickLogDoc}>log</Button>
      </div>
      <TreeView
        class="tree-view"
        data={doc}
        showLogButton
        showCopyButton
        valueFormatter={formatDocNodeValue}
      />
    </div>
  {/snippet}
  {#snippet right()}
    <div class="right-panel">
      <div class="top-row">
        <h2>Selection</h2>
        <Button class="selection-btn" onclick={handleExpandSelection}
          ><span class="caret-icon" class:expanded={expandedSelection} /></Button
        >
      </div>
      <TreeView class="tree-view" data={selection} />
      <div>
        <h2>Active marks</h2>
        {#if activeMarks.length === 0}
          <div class="no-marks">No active marks</div>
        {:else}
          <TreeView class="tree-view" data={activeMarks} />
        {/if}
      </div>
      <div>
        <h2>Document stats</h2>
        <TreeView
          class="tree-view"
          data={{
            nodeSize,
            childCount
          }}
        />
      </div>
    </div>
  {/snippet}
</SplitView>

<style>
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .left-panel {
    overflow: scroll;
  }
  .right-panel {
    border-left: 1px solid rgba(var(--color-red-light-rgb), 0.2);
    flex-grow: 0;
    min-width: 200px;
    width: 200px;
  }
  :global(.split-view .selection-btn) {
    height: 24px;
    width: 35px;
  }
  .caret-icon::before {
    content: '▶';
  }
  .caret-icon.expanded::before {
    content: '▼';
  }
  .no-marks {
    color: var(--color-blue-light);
    margin: 0.5em 0 1.25em 1em;
  }
  :global(.split-view .tree-view) {
    margin: 0.5em 0 1.25em 0;
  }
</style>
