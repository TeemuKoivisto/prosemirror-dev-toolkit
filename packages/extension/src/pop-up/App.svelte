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
  $: devToolsExpanded = $state.devToolsOpts.devToolsExpanded
  $: buttonPosition = $state.devToolsOpts.buttonPosition
  $: foundInstances = $state.inject.instances
  $: found = !disabled && foundInstances.length > 0
  $: selected = $state.inject.instance
  $: injectStatus = $state.inject.status
  $: selector = $state.inject.selector

  let dots = ''
  let setStatusInterval: ReturnType<typeof setTimeout> | undefined

  $: {
    if (injectStatus !== 'finding') {
      dots = ''
      clearInterval(setStatusInterval)
      setStatusInterval = undefined
    } else if (!setStatusInterval) {
      setStatusInterval = setInterval(() => {
        if (dots.length === 3) {
          dots = ''
        } else {
          dots = `${dots}.`
        }
      }, 333)
    }
  }

  onMount(() => {
    send('mount-pop-up', undefined)
    return () => {
      clearInterval(setStatusInterval)
    }
  })

  function handleClickReapply() {
    if (!disabled) {
      send('reapply-devtools', undefined)
    }
  }
  function handleClickExpanded() {
    send('update-global-data', {
      devToolsOpts: {
        devToolsExpanded: !devToolsExpanded
      }
    })
  }
  function handleClickWindow() {
    send('open-in-window', undefined)
  }
  function handleClickDebug() {
    send('update-global-data', {
      showDebug: !showDebug
    })
  }
  function handleClickDisable() {
    send('toggle-disable', undefined)
  }
  function handleClickOptions() {
    send('update-global-data', {
      showOptions: !showOptions
    })
  }
  function handleSelectorChange(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    send('update-page-data', {
      selector: e.currentTarget.value
    })
  }
  function handleToolsPosChange(
    e: Event & {
      currentTarget: EventTarget & HTMLSelectElement
    }
  ) {
    send('update-global-data', {
      devToolsOpts: {
        buttonPosition: e.currentTarget.value as ButtonPosition
      }
    })
  }
  function handleSelectInstance(idx: number) {
    if (idx !== selected) {
      send('update-page-data', {
        instance: idx
      })
    }
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
      {#if injectStatus === 'finding'}
        <span class="inject-status">{injectStatus}{dots}</span>
      {/if}
    </div>
    <div class="header-buttons">
      <button class="icon-btn" on:click={handleClickReapply}>
        <Icon icon={research} width={24} />
      </button>
      <button class="icon-btn" on:click={handleClickDisable}>
        <Icon icon={disabled ? toggleOff : toggle2} width={24} />
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
        <button on:click={handleClickExpanded}>{devToolsExpanded ? 'Expanded' : 'Button'}</button>
        <select value={buttonPosition} on:change={handleToolsPosChange}>
          <option value="bottom-right">Bottom right</option>
          <option value="bottom-left">Bottom left</option>
          <option value="top-right">Top right</option>
          <option value="top-left">Top left</option>
        </select>
        <!-- <button on:click={handleClickWindow}>Window</button> -->
        <button on:click={handleClickDebug}>Debug</button>
      </div>
    </fieldset>
  </div>
  <ol class:hidden={!found}>
    {#each foundInstances as inst, idx}
      <li>
        <div class="inst-row">
          <button
            class="editor-btn"
            class:selected={idx === selected}
            on:click={() => handleSelectInstance(idx)}
          >
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
    border: 1px solid transparent;
    color: white;
    cursor: pointer;
    margin: 0;
    padding: 3px 4px 0 4px;
    &:hover {
      border: 1px dashed #b0b0b0;
    }
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
      border: 0;
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
      background: white;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16px' height='16px' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6.1018 8C5.02785 8 4.45387 9.2649 5.16108 10.0731L10.6829 16.3838C11.3801 17.1806 12.6197 17.1806 13.3169 16.3838L18.8388 10.0731C19.5459 9.2649 18.972 8 17.898 8H6.1018Z' fill='%23212121'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
      border-radius: 2px;
      margin-right: 0.5rem;
      padding: 0 2rem 0 0.75rem;
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
