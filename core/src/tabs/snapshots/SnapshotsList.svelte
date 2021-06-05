<style lang="scss">
  ul {
    color: white;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  li + li {
    border-top: 1px solid #604c68;
  }
  li {
    display: flex;
    font-family: monospace;
    padding: 6px 18px;
    & > div {
      align-items: center;
      display: flex;
      flex-grow: 1;
    }
  }
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
      color: white;
    }
  }
</style>

<script lang="ts">
  export let snapshots = [],
    onRestore,
    onDelete
</script>

<ul>
  {#each snapshots as snap}
    <li>
      <div on:doubleclick={() => console.log('doubleclick')}>{snap.name}</div>
      <button on:click={() => onDelete(snap)}> Delete </button>
      <button on:click={() => onRestore(snap)}> Restore </button>
    </li>
  {/each}
</ul>
