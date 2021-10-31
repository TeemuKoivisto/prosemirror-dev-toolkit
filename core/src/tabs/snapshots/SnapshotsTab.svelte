<script lang="ts">
  import { getContext } from '$context'

  import SplitView from '$tabs/SplitView.svelte'
  import SnapshotsList from './SnapshotsList.svelte'
  import {
    snapshots,
    selectedSnapshot,
    updateSnapshot,
    toggleViewSnapshot,
    restoreSnapshot,
    exportSnapshot,
    deleteSnapshot
  } from '$stores/snapshots'
  import { resetHistory } from '$stores/stateHistory'
  import type { Snapshot } from '$typings/snapshots'

  const { view } = getContext('editor-view')

  function handleRestoreSnapshot(snapshot: Snapshot) {
    restoreSnapshot(view, snapshot)
    resetHistory()
  }
</script>

<SplitView>
  <div slot="right" class="right-panel">
    {#if $snapshots.length === 0}
      <div class="no-snapshots">Save snapshots by clicking "Save snapshot" button.</div>
    {:else}
      <SnapshotsList
        snapshots={$snapshots}
        selectedSnapshot={$selectedSnapshot}
        onUpdate={updateSnapshot}
        onView={snap => toggleViewSnapshot(view, snap)}
        onRestore={handleRestoreSnapshot}
        onExport={exportSnapshot}
        onDelete={deleteSnapshot}
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
    color: $color-red-light;
    display: flex;
    font-size: 14px;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
</style>
