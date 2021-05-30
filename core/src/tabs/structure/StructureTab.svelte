<style lang="scss">
  :root {
    --left-panel-width: 220px;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'
  import { APP_CONTEXT } from '../../context.ts'
  import SplitView from '../SplitView.svelte'
  import TreeView from '../../svelte-tree-view/Main.svelte'
  import DocView from './DocView.svelte'

  const { view } = getContext(APP_CONTEXT)
  let doc = view.state.doc
  let schema = view.state.schema
</script>

<SplitView rightPanelWidth={'220px'}>
  <div slot="left">
    <div class="top-row">
      <h2>Current doc</h2>
    </div>
    <DocView {doc} {schema} />
  </div>
  <div slot="right">
    <div class="top-row">
      <h2>Node info</h2>
      <button>log</button>
    </div>
    <TreeView data={doc} />
  </div>
</SplitView>
