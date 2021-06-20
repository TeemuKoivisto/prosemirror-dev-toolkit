<style lang="scss">
  .right-panel {
    padding: 0;
  }
  .no-snapshots {
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
  import SplitView from './../SplitView.svelte'
  import SnapshotsList from './SnapshotsList.svelte'
  import { snapshots, deleteSnapshot, updateSnapshot, restoreSnapshot } from './snapshots.store.ts'
  import { resetHistory } from '../../state/actions.ts'
  import type { Snapshot } from './snapshots.store.ts'

  const { view } = getContext(APP_CONTEXT)

  function handleDeleteSnapshot(snapshot: Snapshot) {
    deleteSnapshot(snapshot)
  }
  function handleRestoreSnapshot(snapshot: Snapshot) {
    restoreSnapshot(view, snapshot)
    resetHistory()
  }
  function handleUpdateSnapshot(snapshot: Snapshot) {
    updateSnapshot(snapshot)
  }
</script>

<SplitView>
  <div slot="right" class="right-panel">
    {#if $snapshots.length === 0}
      <div class="no-snapshots">Save snapshots by clicking "Save snapshot" button.</div>
    {:else}
      <SnapshotsList
        snapshots={$snapshots}
        onDelete={handleDeleteSnapshot}
        onRestore={handleRestoreSnapshot}
        onUpdate={handleUpdateSnapshot}
      />
    {/if}
  </div>
</SplitView>
