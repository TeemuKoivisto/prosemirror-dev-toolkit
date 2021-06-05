<style lang="scss">
  .panel {
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
  import { Snapshot, snapshots } from './snapshots.store.ts'

  const { view } = getContext(APP_CONTEXT)

  function handleDeleteSnapshot(snapshot: Snapshot) {
    console.log('del', snapshot)
  }
  function handleRestoreSnapshot(snapshot: Snapshot) {
    console.log('res', snapshot)
  }
  console.log('snapshots', $snapshots)
</script>

<SplitView>
  <div slot="right" class="panel">
    {#if $snapshots.length === 0}
      <div class="no-snapshots">Save snapshots by clicking "Save Snapshot" button.</div>
    {:else}
      <SnapshotsList
        snapshots={$snapshots}
        onDelete={handleDeleteSnapshot}
        onRestore={handleRestoreSnapshot}
      />
    {/if}
  </div>
</SplitView>
