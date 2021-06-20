<style lang="scss">
  :root {
    --font-sans: Helvetica Neue, Calibri Light, Roboto, sans-serif;
    --font-small: 11px;
    --font-medium: 13px;
    --font-large: 16px;
    --height-tabs-menu: 48px;
  }
  .floating-dock-wrapper {
    position: fixed;
    width: 0px;
    height: 0px;
    top: 0px;
    left: 0px;
    z-index: 99999999;
  }
  .floating-dock {
    background-color: #363755;
    position: fixed;
    z-index: 1;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 4px 0px;
    left: 0px;
    top: 50%;
    width: 100%;
    height: 50%;
  }
  .resizing-div {
    position: absolute;
    z-index: 2;
    opacity: 0;
    top: -5px;
    height: 10px;
    left: 0px;
    width: 100%;
    cursor: row-resize;
  }
  .container {
    height: 100%;
  }
  .snapshot-btn {
    background: rgba(255, 162, 177, 0.6);
    border: 0;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
    font-size: 12px;
    height: 24px;
    line-height: 25px;
    padding: 0 6px;
    position: absolute;
    right: 32px;
    top: -28px;
    &:hover {
      background: rgba(255, 162, 177, 0.8);
    }
  }
  .close-btn {
    background: rgba(255, 162, 177, 0.6);
    border: 0;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
    height: 24px;
    position: absolute;
    right: 4px;
    top: -28px;
    width: 24px;
    &:hover {
      background: rgba(255, 162, 177, 0.8);
    }
  }
  * {
    font-family: var(--font-sans);
    font-size: var(--font-medium);
  }
</style>

<script lang="ts">
  import TabsMenu from './tabs/TabsMenu.svelte'
  import StateTab from './tabs/state/StateTab.svelte'
  import HistoryTab from './tabs/history/HistoryTab.svelte'
  import PluginsTab from './tabs/PluginsTab.svelte'
  import SchemaTab from './tabs/SchemaTab.svelte'
  import StructureTab from './tabs/structure/StructureTab.svelte'
  import SnapshotsTab from './tabs/snapshots/SnapshotsTab.svelte'

  import { getContext, onMount } from 'svelte'
  import { APP_CONTEXT } from './context.ts'
  import { saveSnapshot } from './tabs/snapshots/snapshots.store.ts'

  export let onClose

  const { view } = getContext(APP_CONTEXT)
  let openTab = 'state',
    dockTop = 50,
    dockHeight = 50

  onMount(() => {
    return () => {
      document.removeEventListener('mousemove', dragMove)
      document.removeEventListener('mouseup', dragEnd)
    }
  })

  function handleResizeMouseDown(e: any) {
    document.addEventListener('mousemove', dragMove)
    document.addEventListener('mouseup', dragEnd)
  }
  function dragMove(evt: MouseEvent) {
    evt.preventDefault()
    dockTop = (100 * evt.clientY) / window.innerHeight
    dockHeight = 100 * (1 - evt.clientY / window.innerHeight)
  }
  function dragEnd(evt: MouseEvent) {
    evt.preventDefault()
    document.removeEventListener('mousemove', dragMove)
    document.removeEventListener('mouseup', dragEnd)
  }
  function handleSaveSnapshot() {
    const snapshotName = prompt('Enter snapshot name', Date.now())
    if (snapshotName) {
      saveSnapshot(snapshotName, view.state.doc.toJSON())
    }
  }
  function handleClickTab(tab: string) {
    openTab = tab
  }
</script>

<div class="floating-dock-wrapper">
  <div class="floating-dock" style={`top: ${dockTop}%; height: ${dockHeight}%;`}>
    <div class="resizing-div" on:mousedown={handleResizeMouseDown} />
    <div class="container">
      <div>
        <button class="snapshot-btn" on:click={handleSaveSnapshot}>Save snapshot</button>
        <button class="close-btn" on:click={onClose}>X</button>
      </div>
      <TabsMenu onClickTab={handleClickTab} active={openTab} />
      {#if openTab === 'state'}
        <StateTab />
      {:else if openTab === 'history'}
        <HistoryTab />
      {:else if openTab === 'plugins'}
        <PluginsTab />
      {:else if openTab === 'schema'}
        <SchemaTab />
      {:else if openTab === 'structure'}
        <StructureTab />
      {:else if openTab === 'snapshots'}
        <SnapshotsTab />
      {:else}
        <p>nuting here</p>
      {/if}
    </div>
  </div>
</div>
