<style lang="scss">
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .left-panel {
    overflow: scroll;
  }
  .right-panel {
    border-left: 1px solid rgba($color-red-light, 0.2);
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
    margin: 0.5em 0 1em 1em;
  }
  :global(.split-view .tree-view) {
    margin: 0.5em 0 1em 0;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { get } from 'svelte/store'
  import { latestEntry } from '../../state/stateHistory.store.ts'
  import { getActiveMarks } from '../../state/getActiveMarks.ts'
  import { createSelection, createFullSelection } from './selection.ts'

  import SplitView from '../SplitView.svelte'
  import TreeView from '../../svelte-tree-view/Main.svelte'
  import Button from '../../Button.svelte'

  const { view } = getContext('editor-view')
  let doc = view.state.doc.toJSON()
  let selection = createSelection(view.state.selection)
  let currentState = view.state
  let activeMarks = []
  let nodeSize = view.state.doc.nodeSize
  let childCount = view.state.doc.childCount
  let expandedSelection = false

  latestEntry.subscribe(e => {
    if (!e) return
    const { state } = e
    currentState = state
    doc = state.doc.toJSON()
    selection = createSelection(state.selection)
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
  function formatDocNodeValue(val: any, n: ITreeNode) {
    if (n.type === 'object' && val.type) {
      return `{} ${val.type}`
    }
  }
</script>

<SplitView>
  <div slot="left" class="left-panel">
    <div class="top-row">
      <h2>Current doc</h2>
      <Button on:click={handleClickLogDoc}>log</Button>
    </div>
    <TreeView
      class="tree-view"
      data={doc}
      showLogButton
      showCopyButton
      valueFormatter={formatDocNodeValue}
    />
  </div>
  <div slot="right" class="right-panel">
    <div class="top-row">
      <h2>Selection</h2>
      <Button class="selection-btn" on:click={handleExpandSelection}
        ><span class="caret-icon" class:expanded={expandedSelection} /></Button
      >
    </div>
    <!-- See https://github.com/sveltejs/svelte/issues/3165#issuecomment-804354493 -->
    {#each [...[]] as _}
      <div />
    {:else}
      <TreeView
        class="tree-view"
        data={selection}
        recursionOpts={{
          maxDepth: 10
        }}
      />
    {/each}
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
</SplitView>
