<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import cog from '@iconify-icons/mdi/cog.js'
  import cogOff from '@iconify-icons/mdi/cog-off.js'
  import toggleOff from '@iconify-icons/mdi/toggle-switch-off-outline.js'
  import toggle2 from '@iconify-icons/mdi/toggle-switch.js'
  import research from '@iconify-icons/mdi/find-replace.js'

  import { received, send, state } from './store'
  import type { ButtonPosition } from 'prosemirror-dev-toolkit'

  $: disabled = $state.disabled
  $: showOptions = $state.showOptions
  $: showDebug = $state.showDebug
  $: foundInstances = $state.instances
  $: found = !disabled && foundInstances.length > 0
  $: injectStatus = $state.inject.status
  $: selector = $state.inject.selector

  onMount(() => {
    send('mount-pop-up', undefined)
  })

  function handleClickReapply() {
    send('reapply-devtools', undefined)
  }
  function handleClickDebug() {
    send('update-state', {
      showDebug: !showDebug
    })
  }
  function handleClickDisable() {
    send('toggle-disable', undefined)
  }
  function handleClickOptions() {
    send('update-state', {
      showOptions: !showOptions
    })
  }
  function handleSelectorChange(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    send('update-state', {
      inject: {
        selector: e.currentTarget.value
      }
    })
  }
  function handleToolsPosChange(
    e: Event & {
      currentTarget: EventTarget & HTMLSelectElement
    }
  ) {
    send('update-state', {
      devToolsOpts: {
        buttonPosition: e.currentTarget.value as ButtonPosition
      }
    })
  }
</script>

<main>
  <header>
    <div class="title-container">
      {#if found}
        <img class="pm-icon" src="pm.png" alt="ProseMirror logo" height="30" />
      {/if}
      <h1>
        {#if disabled}
          DevTools disabled
        {:else if found}
          ProseMirror detected
        {:else}
          No ProseMirror found
        {/if}
      </h1>
      <span class="inject-status">{injectStatus}</span>
    </div>
    <div class="header-buttons">
      <button class="icon-btn" on:click={handleClickReapply}>
        <Icon icon={research} width={24} />
      </button>
      <button class="icon-btn" on:click={handleClickDisable}>
        <Icon icon={disabled ? toggle2 : toggleOff} width={24} />
      </button>
      <button class="icon-btn" on:click={handleClickOptions}>
        <Icon icon={showOptions ? cogOff : cog} width={24} />
      </button>
    </div>
  </header>
  <div class="options" class:hidden={!showOptions}>
    <fieldset>
      <legend>Options</legend>
      <div class="field">
        <label for="pm-el-selector">Selector</label>
        <input id="pm-el-selector" value={selector} on:change={handleSelectorChange} />
      </div>
      <div class="options-buttons">
        <button>Data</button>
        <button>Disable for page</button>
        <button on:click={handleClickDebug}>Debug</button>
        <select on:change={handleToolsPosChange}>
          <option value="bottom-right">Bottom right</option>
          <option value="bottom-left">Bottom left</option>
          <option value="top-right">Top right</option>
          <option value="top-left">Top left</option>
        </select>
      </div>
    </fieldset>
  </div>
  <ol class:hidden={!found}>
    {#each foundInstances as inst}
      <li>
        <div class="inst-row">
          <button class="editor-btn" class:selected={true}>
            {inst.element}
          </button>
          {inst.size}
        </div>
      </li>
    {/each}
  </ol>
  <ul class:hidden={!showDebug}>
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
    width: 30rem;
  }
  header {
    display: flex;
    justify-content: space-between;
  }
  .title-container {
    align-items: center;
    display: flex;
  }
  .pm-icon {
    margin-right: 0.5rem;
  }
  h1 {
    align-items: center;
    color: white;
    display: flex;
    // font-family: Arial, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 20px;
    margin: 0 0 0 0.5rem;
  }
  .inject-status {
    margin-left: 1rem;
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
    display: flex;
    & > * + * {
      margin-left: 0.75rem;
    }
  }
  .options {
    margin-top: 0.75rem;

    fieldset {
      padding: 0.5rem 1rem 1rem 1rem;
    }
    label {
      font-size: 0.75rem;
      margin: 0 0 4px 0;
    }
    input {
      padding: 2px 4px;
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
      border: 1px dashed #b0b0b0;
      border-radius: 2px;
      color: #d3d3d9;
      cursor: pointer;
      display: flex;
      font-size: 11px;
      margin-right: 0.5rem;
      padding: 6px 18px;
      text-transform: uppercase;
      &:hover {
        background: rgba(255, 162, 177, 0.4);
        color: #fff;
      }
    }

    select {
      appearance: none;
      padding: 0 0.5rem;
    }

    select::after {
      position: absolute;
      content: '^';
      top: 14px;
      right: 10px;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-color: #fff transparent transparent transparent;
    }
  }
  ul {
    list-style: none;
    margin: 1rem 0 0 0;
    padding: 0 0 0 1rem;
  }
  ol {
    margin: 1rem 0 0 0;
    padding: 0 0 0 1rem;
  }
  li {
    margin: 0;
    padding: 0;
  }
  li + li {
    border-top: 0;
    margin-top: 4px;
    padding-top: 4px;
  }
  .inst-row {
    align-items: center;
    display: flex;
  }
  .editor-btn {
    background: transparent;
    border: 0;
    border-radius: 2px;
    color: #faf8f5;
    cursor: pointer;
    margin: 0.25rem 0.5rem;
    padding: 0.5rem 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.selected {
      border: 1px dashed #b0b0b0;
    }
    &:hover {
      background: rgba(255, 162, 177, 0.4);
    }
  }
</style>
