<script lang="ts">
  import { getContext } from 'svelte'

  import SplitView from '$tabs/SplitView.svelte'
  import SnapshotsList from './SnapshotsList.svelte'
  import {
    snapshots,
    deleteSnapshot,
    updateSnapshot,
    restoreSnapshot
  } from '$stores/snapshots'
  import { resetHistory } from '$stores/stateHistory'
  import type { Snapshot } from '$typings/snapshots'

  const { view } = getContext('editor-view')

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

<style lang="scss">
  .right-panel {
    padding: 0;
  }
  .no-snapshots {
    align-items: center;
    color: var(--color-red-light);
    display: flex;
    font-size: 14px;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
</style>
