<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import check from '@iconify-icons/mdi/check-bold.js'
  import close from '@iconify-icons/mdi/close.js'
  import cog from '@iconify-icons/mdi/cog.js'
  import cogOff from '@iconify-icons/mdi/cog-off.js'
  import toggle from '@iconify-icons/mdi/toggle-switch-outline.js'
  import toggleOff from '@iconify-icons/mdi/toggle-switch-off-outline.js'
  import toggle2 from '@iconify-icons/mdi/toggle-switch.js'
  import magnify from '@iconify-icons/mdi/magnify-scan.js'

  import { disabled, foundInstances, showOptions, showDebug, received, send } from './store'

  const svgUrl = new URL('./pm-black.svg', import.meta.url).href

  onMount(() => {
    send('mount-pop-up', true)
  })

  function handleClickDebug() {
    showDebug.update(val => !val)
  }
  function handleClickDisable() {
    send('toggle-disable', true)
  }
  function handleClickOptions() {
    showOptions.update(val => !val)
  }
</script>

<main>
  <header>
    <div class="title-container">
      <div class="found-icon">
        <Icon icon={$foundInstances.length > 0 ? check : close} width={24} />
      </div>
      <h1>
        {#if $foundInstances.length > 0}
          ProseMirror detected
        {:else}
          No ProseMirror found
        {/if}
      </h1>
    </div>
    <div class="header-buttons">
      <button class="icon-btn" on:click={handleClickDebug}>
        <Icon icon={$showDebug ? magnify : magnify} width={24} />
      </button>
      <button class="icon-btn" on:click={handleClickDisable}>
        <Icon icon={$disabled ? toggle2 : toggleOff} width={24} />
      </button>
      <button class="icon-btn" on:click={handleClickOptions}>
        <Icon icon={$showOptions ? cogOff : cog} width={24} />
      </button>
    </div>
  </header>
  <div class="options" class:hidden={!$showOptions}>
    <fieldset>
      <legend>Options</legend>
      <div class="field">
        <label for="pm-el-selector">Selector</label>
        <input id="pm-el-selector" value=".ProseMirror" />
      </div>
      <div class="options-buttons">
        <button>Reload</button>
        <button>Data</button>
        <!-- <button on:click={handleClickDisable}>{$disabled ? 'Enable' : 'Disable'}</button> -->
        <button>Disable for page</button>
      </div>
    </fieldset>
  </div>
  <ul class:hidden={$foundInstances.length === 0}>
    {#each $foundInstances as inst}
      <li>
        <button class="editor-btn" class:selected={true}>Size: {inst.size} {inst.classes}</button>
      </li>
    {/each}
  </ul>
  <ul class:hidden={!$showDebug}>
    {#each $received as msg}
      <li>{JSON.stringify(msg)}</li>
    {/each}
  </ul>
</main>

<style lang="scss">
  :global(html) {
    font-size: 16px;
  }
  :global(body) {
    margin: 0;
    padding: 0;
  }
  .hidden {
    display: none;
    visibility: hidden;
  }
  main {
    background-color: #363755;
    color: #85d9ef;
    padding: 1rem;
    min-width: 30rem;
  }
  header {
    display: flex;
    justify-content: space-between;
  }
  .title-container {
    display: flex;
  }
  .found-icon {
  }
  h1 {
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
    font-weight: 400;
    margin: 0 0 0 0.75rem;
  }
  .selected {
    background: lightblue;
  }
  .icon-btn {
    background: transparent;
    border: 0;
    color: white;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }
  .header-buttons {
    & > * + * {
      margin-left: 0.5rem;
    }
  }
  .editor-btn {
    background: transparent;
    border: 0;
    border-radius: 2px;
    color: #faf8f5;
    cursor: pointer;
    margin: 0;
    padding: 10px;
    &.selected {
      border: 1px solid #85d9ef;
    }
  }
  .options {
    margin-top: 0.5rem;

    fieldset {
      padding: 0.5rem 1rem 1rem 1rem;
    }
  }
  .field {
    display: flex;
    flex-direction: column;
  }
  .options-buttons {
    display: flex;
    margin-top: 1rem;

    button {
      background: transparent;
      border: 0;
      border-radius: 3px;
      color: #d3d3d9;
      cursor: pointer;
      display: flex;
      font-size: 11px;
      padding: 6px 18px;
      text-transform: uppercase;
      &:hover {
        background: rgba(255, 162, 177, 0.4);
        color: #fff;
      }
    }
  }
  ul {
    list-style: none;
    margin: 1rem 0 0 0;
    padding: 0;
  }
  li {
    align-items: center;
    border: 1px solid rgb(96, 76, 104);
    display: flex;
    margin: 0;
    padding-left: 2rem;
    &:hover {
      background: rgba(255, 162, 177, 0.4);
    }
  }
  li + li {
    border-top: 0;
    margin-top: 4px;
    padding-top: 4px;
  }
</style>
