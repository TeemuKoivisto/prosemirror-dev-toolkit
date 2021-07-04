<style lang="scss">
  ul {
    color: var(--color-white);
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  li + li {
    border-top: 1px solid var(--color-purple);
  }
  li {
    align-items: center;
    display: flex;
    font-family: monospace;
    padding: 6px 18px;
    & > div {
      align-items: center;
      display: flex;
      flex-grow: 1;
    }
  }
  input {
    background: transparent;
    border: 0;
    color: var(--color-white);
    height: 100%;
    margin: 0;
    padding: 2px;
    width: 100%;
  }
  button {
    background: transparent;
    border: 0;
    border-radius: 3px;
    color: var(--color-gray-light);
    cursor: pointer;
    display: flex;
    font-size: 11px;
    padding: 6px 18px;
    text-transform: uppercase;
    &:hover {
      background: rgba($color-red-light, 0.4);
      color: var(--color-white);
    }
  }
</style>

<script lang="ts">
  import type { Snapshot } from './snapshots.store.ts'

  export let snapshots = [],
    onUpdate,
    onRestore,
    onDelete
  let editedSnap
  let timer

  const debounceUpdate = (s: Snapshot) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      onUpdate(editedSnap)
    }, 150)
  }

  function handleSnapDoubleclick(snap: Snapshot) {
    editedSnap = snap
  }
  function handleNameChange(evt: any) {
    editedSnap.name = evt.target.value
    debounceUpdate()
  }
  function handleNameKeyPress(evt: any) {
    if (evt.key === 'Enter') {
      onUpdate(editedSnap)
      clearTimeout(timer)
      editedSnap = undefined
    }
  }
</script>

<ul>
  {#each snapshots as snap}
    <li>
      {#if editedSnap && editedSnap.timestamp === snap.timestamp}
        <input
          value={editedSnap.name}
          on:input={handleNameChange}
          on:keypress={handleNameKeyPress}
        />
      {:else}
        <div on:dblclick={() => handleSnapDoubleclick(snap)}>{snap.name}</div>
      {/if}
      <button on:click={() => onDelete(snap)}> Delete </button>
      <button on:click={() => onRestore(snap)}> Restore </button>
    </li>
  {/each}
</ul>
