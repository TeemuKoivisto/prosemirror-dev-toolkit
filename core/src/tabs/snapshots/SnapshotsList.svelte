<script lang="ts">
  import type { Snapshot } from '$typings/snapshots'

  export let snapshots: Snapshot[] = [],
    selectedSnapshot: Snapshot | undefined = undefined,
    onUpdate: (snap: Snapshot) => void,
    onView: (snap?: Snapshot) => void,
    onRestore: (snap: Snapshot) => void,
    onExport: (snap: Snapshot) => void,
    onDelete: (snap: Snapshot) => void

  let editedSnap: Snapshot | undefined
  let deleteSnap: Snapshot | undefined
  let timer: number | undefined

  const debounceUpdate = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      onUpdate(editedSnap as Snapshot)
    }, 150)
  }

  function handleSnapDoubleclick(snap: Snapshot) {
    editedSnap = snap
    deleteSnap = undefined
  }
  function handleNameChange(evt: any) {
    if (editedSnap) {
      editedSnap.name = evt.target.value
      debounceUpdate()
    }
  }
  function handleNameKeyPress(evt: any) {
    if (evt.key === 'Enter' && editedSnap) {
      onUpdate(editedSnap)
      clearTimeout(timer)
      editedSnap = undefined
      deleteSnap = undefined
    }
  }
  function handleClickView(snap: Snapshot) {
    if (selectedSnapshot?.timestamp === snap.timestamp) {
      onView()
    } else {
      onView(snap)
    }
    deleteSnap = undefined
  }
  function handleRestoreClick(snap: Snapshot) {
    onRestore(snap)
    deleteSnap = undefined
  }
  function handleExportClick(snap: Snapshot) {
    onExport(snap)
    deleteSnap = undefined
  }
  function handleClickDelete(snap: Snapshot) {
    if (!deleteSnap || deleteSnap.timestamp !== snap.timestamp) {
      deleteSnap = snap
    } else {
      onDelete(snap)
      deleteSnap = undefined
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
        <button
          class="unstyled-btn"
          aria-label="Edit snapshot name button"
          on:dblclick={() => handleSnapDoubleclick(snap)}>{snap.name}</button
        >
      {/if}
      <button class="snapshot-btn ml-2" on:click={() => handleClickView(snap)}>
        {#if selectedSnapshot?.timestamp === snap.timestamp}
          Hide
        {:else}
          Show
        {/if}
      </button>
      <button class="snapshot-btn" on:click={() => handleRestoreClick(snap)}>Restore</button>
      <button class="snapshot-btn" on:click={() => handleExportClick(snap)}>Export</button>
      <button class="snapshot-btn" on:click={() => handleClickDelete(snap)}>
        {#if deleteSnap?.timestamp === snap.timestamp}
          Confirm Delete
        {:else}
          Delete
        {/if}
      </button>
    </li>
  {/each}
</ul>

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
  .unstyled-btn {
    background: transparent;
    border: 0;
    color: var(--color-white);
    cursor: pointer;
    display: block;
    font-family: monospace;
    margin: 0;
    padding: 0;
    text-align: start;
    width: 100%;
  }
  .snapshot-btn {
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
  .ml-2 {
    margin-left: 1rem;
  }
</style>
