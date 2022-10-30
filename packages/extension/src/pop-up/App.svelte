<script lang="ts">
  import { onMount } from 'svelte'

  import { disabled, connected, foundInstances, received, send } from './store'

  onMount(() => {
    send('mount-pop-up', true)
  })

  function handleClickDisable() {
    send('toggle-disable', true)
  }
</script>

<main>
  <h1>
    {#if $foundInstances.length > 0}
      ProseMirror detected
    {:else}
      No ProseMirror found
    {/if}
  </h1>
  <p>Connected: {$connected}</p>
  <div class="field">
    <label for="pm-el-selector">Selector</label>
    <input id="pm-el-selector" value=".ProseMirror" />
  </div>
  <div>
    <button>Reload</button>
    <button>Data</button>
    <button on:click={handleClickDisable}>{$disabled ? 'Enable' : 'Disable'}</button>
    <button>Disable for page</button>
  </div>
  <ul>
    {#each $foundInstances as inst}
      <li>
        <button class="editor-btn" class:selected={true}>Size: {inst.size} {inst.classes}</button>
      </li>
    {/each}
  </ul>
  <ul>
    {#each $received as msg}
      <li>{JSON.stringify(msg)}</li>
    {/each}
  </ul>
</main>

<style lang="scss">
  main {
    min-width: 600px;
  }
  h1 {
    font-size: 20px;
  }
  .selected {
    background: lightblue;
  }
  .editor-btn {
    background: transparent;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
    margin: 0;
    padding: 10px;
    &.selected {
      border: 2px solid #666;
    }
  }
  .field {
    display: flex;
    flex-direction: column;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li + li {
    margin-top: 4px;
    padding-top: 4px;
  }
</style>
