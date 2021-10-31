<script lang="ts">
  import { onDestroy } from 'svelte'
  import { getContext } from '$context'

  import { saveSnapshot, importSnapshot } from '$stores/snapshots'

  import TabsMenu from '$tabs/TabsMenu.svelte'
  import StateTab from '$tabs/state/StateTab.svelte'
  import HistoryTab from '$tabs/history/HistoryTab.svelte'
  import PluginsTab from '$tabs/PluginsTab.svelte'
  import SchemaTab from '$tabs/SchemaTab.svelte'
  import StructureTab from '$tabs/structure/StructureTab.svelte'
  import SnapshotsTab from '$tabs/snapshots/SnapshotsTab.svelte'

  export let onClose: () => void

  const { view } = getContext('editor-view')
  let openTab = 'state',
    dockTop = 50,
    dockHeight = 50,
    fileinput: HTMLInputElement

  onDestroy(() => {
    document.removeEventListener('mousemove', dragMove)
    document.removeEventListener('mouseup', dragEnd)
  })

  function handleResizeMouseDown() {
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
    const defaultName = new Date().toLocaleString('sv')
    const snapshotName = prompt('Enter snapshot name', defaultName)
    if (snapshotName) {
      saveSnapshot(snapshotName, view.state.doc.toJSON())
    }
  }
  function handleImportSnapshot() {
    fileinput.click()
  }
  function handleFileSelected(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    const target = <HTMLInputElement>e.target
    Array.from(target.files || []).forEach(file => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = e => {
        const data = typeof e.target?.result === 'string' ? e.target?.result : ''
        try {
          const json = JSON.parse(data)
          if (!json || typeof json !== 'object') {
            throw Error('Imported snapshot was not a JSON object' + json)
          }
          const name = file.name.slice(0, file.name.lastIndexOf('.'))
          importSnapshot(name, json, view.state.schema)
        } catch (err) {
          console.error('Failed to import snapshot: ' + err)
        }
      }
    })
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
        <button class="snap-save-btn" on:click={handleSaveSnapshot}>Save snapshot</button>
        <button class="snap-import-btn" on:click={handleImportSnapshot}>Import snapshot</button>
        <button class="close-btn" aria-label="Close dev-toolkit button" on:click={onClose}>X</button
        >
      </div>
      <input
        style="display:none"
        type="file"
        accept=".json"
        multiple
        on:change={handleFileSelected}
        bind:this={fileinput}
      />
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

<style lang="scss">
  .floating-dock-wrapper {
    position: fixed;
    width: 0px;
    height: 0px;
    top: 0px;
    left: 0px;
    z-index: 99999999;
  }
  .floating-dock {
    background-color: $color-blue-bg;
    position: fixed;
    z-index: 1;
    box-shadow: rgba($color-black, 0.3) 0px 0px 4px 0px;
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
  .snap-save-btn {
    background: rgba($color-red-light, 0.6);
    border: 0;
    border-radius: 3px;
    color: $color-white;
    cursor: pointer;
    font-size: 12px;
    height: 24px;
    line-height: 25px;
    padding: 0 6px;
    position: absolute;
    right: 134px;
    top: -28px;
    &:hover {
      background: rgba($color-red-light, 0.8);
    }
  }
  .snap-import-btn {
    background: rgba($color-red-light, 0.6);
    border: 0;
    border-radius: 3px;
    color: $color-white;
    cursor: pointer;
    font-size: 12px;
    height: 24px;
    line-height: 25px;
    padding: 0 6px;
    position: absolute;
    right: 32px;
    top: -28px;
    &:hover {
      background: rgba($color-red-light, 0.8);
    }
  }
  .close-btn {
    background: rgba($color-red-light, 0.6);
    border: 0;
    border-radius: 3px;
    color: $color-white;
    cursor: pointer;
    height: 24px;
    position: absolute;
    right: 4px;
    top: -28px;
    width: 24px;
    &:hover {
      background: rgba($color-red-light, 0.8);
    }
  }
</style>
