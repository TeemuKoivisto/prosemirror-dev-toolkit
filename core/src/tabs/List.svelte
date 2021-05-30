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
  button {
    background: transparent;
    border: 0;
    color: #d3d3d9;
    cursor: pointer;
    display: flex;
    font-family: monospace;
    font-size: 11px;
    height: 100%;
    padding: 6px 18px;
    text-transform: uppercase;
    width: 100%;
    &:hover {
      background: rgba(255, 162, 177, 0.4);
      color: white;
    }
    &.selected {
      background: rgba(255, 162, 177, 0.4);
    }
    &.empty {
      background: transparent;
      color: #63637b;
    }
  }
</style>

<script lang="ts">
  export let listItems = [],
    selectedItem = '',
    onSelect
</script>

<ul>
  {#each listItems as item}
    <li>
      <button
        class:selected={selectedItem === item.key}
        class:empty={item.empty}
        on:click={() => onSelect(item)}>{item.value}</button
      >
    </li>
  {/each}
</ul>
