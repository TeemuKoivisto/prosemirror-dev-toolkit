<style lang="scss">
  :root {
    --json-tree-label-color: rgb(133, 217, 239);
    --json-tree-string-color: rgb(184, 226, 72);
    --json-tree-number-color: rgb(184, 226, 72);
  }
  .top-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .left-panel {
    overflow: scroll;
  }
  .right-panel {
    border-left: 1px solid rgba(255, 162, 177, 0.2);
    flex-grow: 0;
    min-width: 200px;
    width: 200px;
    & > .row + .row {
      margin: 1em 0;
    }
  }
  :global(.selection-btn) {
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
    color: #85d9ef;
    margin: 1em 0 0 1em;
  }
  :global(.tree-view) {
    margin: 1em 0;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { get } from 'svelte/store'
  import { APP_CONTEXT } from '../../context.ts'
  import { stateHistory } from '../../state/stateHistory.store.ts'
  import { getActiveMarks } from '../../state/getActiveMarks.ts'
  import { createSelection, createFullSelection } from './selection.ts'

  import SplitView from '../SplitView.svelte'
  import TreeView from '../../svelte-tree-view/Main.svelte'
  import Button from '../../Button.svelte'

  const { view } = getContext(APP_CONTEXT)
  let doc = view.state.doc.toJSON()
  let selection = createSelection(view.state.selection)
  let currentState = get(stateHistory)[0]?.state || view.state
  let activeMarks = []
  let nodeSize = view.state.doc.nodeSize
  let childCount = view.state.doc.childCount
  let expandedSelection = false

  stateHistory.subscribe(val => {
    let currentEntry = val[0]
    if (currentEntry) {
      const { state } = currentEntry
      currentState = state
      doc = state.doc.toJSON()
      selection = createSelection(state.selection)
      activeMarks = getActiveMarks(state)
      nodeSize = state.doc.nodeSize
      childCount = state.doc.childCount
    }
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
      maxDepth={6}
      valueFormatter={formatDocNodeValue}
    />
  </div>
  <div slot="right" class="right-panel">
    <div class="top-row row">
      <h2>Selection</h2>
      <Button class="selection-btn" on:click={handleExpandSelection}
        ><span class="caret-icon" class:expanded={expandedSelection} /></Button
      >
    </div>
    <!-- See https://github.com/sveltejs/svelte/issues/3165#issuecomment-804354493 -->
    {#each [...[]] as _}
      <div />
    {:else}
      <TreeView class="tree-view" data={selection} />
    {/each}
    <div class="row">
      <h2>Active marks</h2>
      {#if activeMarks.length === 0}
        <div class="no-marks">No active marks</div>
      {:else}
        <TreeView class="tree-view" data={activeMarks} />
      {/if}
    </div>
    <div class="row">
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
