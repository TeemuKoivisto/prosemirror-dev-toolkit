<script lang="ts">
  import type { Snapshot } from '$typings/snapshots'

  interface Props {
    snapshots?: Snapshot[]
    selectedSnapshot?: Snapshot | undefined
    onUpdate: (snap: Snapshot) => void
    onView: (snap?: Snapshot) => void
    onRestore: (snap: Snapshot) => void
    onExport: (snap: Snapshot) => void
    onDelete: (snap: Snapshot) => void
  }
  const {
    snapshots = [],
    selectedSnapshot = undefined,
    onUpdate,
    onView,
    onRestore,
    onExport,
    onDelete
  }: Props = $props()

  let editedSnap: Snapshot | undefined = $state()
  let deleteSnap: Snapshot | undefined = $state()
  let timer: ReturnType<typeof setTimeout> | undefined

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
  function handleNameChange(evt: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    if (editedSnap) {
      editedSnap.name = evt.currentTarget.value
      debounceUpdate()
    }
  }
  function handleNameKeyPress(evt: KeyboardEvent) {
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
        <input value={editedSnap.name} oninput={handleNameChange} onkeypress={handleNameKeyPress} />
      {:else}
        <button
          class="unstyled-btn"
          aria-label="Edit snapshot name button"
          ondblclick={() => handleSnapDoubleclick(snap)}>{snap.name}</button
        >
      {/if}
      <button class="snapshot-btn ml-2" onclick={() => handleClickView(snap)}>
        {#if selectedSnapshot?.timestamp === snap.timestamp}
          Hide
        {:else}
          Show
        {/if}
      </button>
      <button class="snapshot-btn" onclick={() => handleRestoreClick(snap)}>Restore</button>
      <button class="snapshot-btn" onclick={() => handleExportClick(snap)}>Export</button>
      <button class="snapshot-btn" onclick={() => handleClickDelete(snap)}>
        {#if deleteSnap?.timestamp === snap.timestamp}
          Confirm Delete
        {:else}
          Delete
        {/if}
      </button>
    </li>
  {/each}
</ul>

<style>
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
  }
  .snapshot-btn:hover {
    background: rgba(var(--color-red-light-rgb), 0.4);
    color: var(--color-white);
  }
  .ml-2 {
    margin-left: 1rem;
  }
</style>
