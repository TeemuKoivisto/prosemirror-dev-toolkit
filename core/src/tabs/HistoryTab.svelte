<style lang="scss">
  .left-panel {
    border-right: 1px solid #604c68;
    flex-grow: 0;
    padding: 0;
    width: 190px;
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
  import { HistoryEntry, stateHistory } from '../editor-state.store.ts'
  import SplitView from './SplitView.svelte'
  import List from './List.svelte'

  const { view } = getContext(APP_CONTEXT)
  let selectedEntry = $stateHistory[0]
  $: listItems = $stateHistory.map((e: HistoryEntry) => ({
    key: e.id,
    value: e.timestamp.toString()
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
    <div class="equal-diff">Docs are equal.</div>
  </div>
</SplitView>
