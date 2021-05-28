<style lang="css">
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
    box-shadow: rgb(0 0 0 / 30%) 0px 0px 4px;
    left: 0px;
    top: 50%;
    width: 100%;
    height: 50%;
    transition: left 0.2s ease-out 0s, top 0.2s ease-out 0s, width 0.2s ease-out 0s,
      height 0.2s ease-out 0s;
  }
</style>

<script lang="ts">
  import TabsMenu from './tabs/TabsMenu.svelte'
  import StateTab from './tabs/StateTab.svelte'
  import HistoryTab from './tabs/HistoryTab.svelte'

  export let onClose

  let openTab = 'state'

  function handleClickTab(tab: any) {
    if (tab === 'close') {
      onClose()
    } else {
      openTab = tab
    }
  }
</script>

<div class="floating-dock-wrapper">
  <div class="floating-dock">
    <TabsMenu onClickTab={handleClickTab} />
    {#if openTab === 'state'}
      <StateTab />
    {:else if openTab === 'history'}
      <HistoryTab />
    {:else}
      <p>nuting here</p>
    {/if}
  </div>
</div>
